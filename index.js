/**
 * Bot de WhatsApp — Miku 5.0
 * IA 100% local (sem APIs), sistema de pets, batalhas dinâmicas,
 * botões interativos, perfil personalizável, música otimizada.
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadMediaMessage,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");

const { db, salvar, pegarUsuario, pegarGrupo } = require("./lib/db");
const { darXpPorMensagem } = require("./lib/xp");
const {
  responderIA,
  adicionarMemoria,
  pegarHistorico,
  montarContexto,
} = require("./lib/ia");
const { aprender } = require("./lib/aprendizado");
const { FRASES_SEMENTE } = require("./lib/seedIA");
const { registrarProgressoMissao } = require("./lib/sistemas");
const { gerarImagemBoasVindas } = require("./lib/imagem");
const { analisarTravazap, detectarTextoNsfw } = require("./lib/protecao");
const {
  TODOS_COMANDOS,
  COMANDOS_SOMENTE_DONO,
  COMANDOS_ADMIN_GRUPO,
  ehAdminDoGrupo,
  ehDono,
  definirNumeroDonoExibicao,
  entregarRecados,
} = require("./lib/commands");

const PREFIX = "!";
const REGEX_LINK = /(https?:\/\/|www\.|chat\.whatsapp\.com)/i;
const REGEX_GATILHO_IA = /\b(kok|miku)\b/i;
const avisosProtecao = new Map();
const INTERVALO_AVISO_PROTECAO_MS = 30_000;

const NUMEROS_DONO = ["351911756222", "558183983567", "258712321191965", "21359392510098"];
definirNumeroDonoExibicao(NUMEROS_DONO);

function podeAvisarProtecao(chatId) {
  const agora = Date.now();
  const ultimoAviso = avisosProtecao.get(chatId) || 0;
  if (agora - ultimoAviso < INTERVALO_AVISO_PROTECAO_MS) return false;

  if (avisosProtecao.size > 500) {
    for (const [jid, instante] of avisosProtecao) {
      if (agora - instante >= INTERVALO_AVISO_PROTECAO_MS) avisosProtecao.delete(jid);
    }
  }
  avisosProtecao.set(chatId, agora);
  return true;
}

async function removerMensagemProtegida(sock, from, msg, senderJid, motivo) {
  let removida = false;
  try {
    await sock.sendMessage(from, { delete: msg.key });
    removida = true;
  } catch (erro) {
    console.warn("Não foi possível remover mensagem sinalizada pela proteção.");
  }

  if (!podeAvisarProtecao(from)) return;
  const mencao = senderJid ? `@${senderJid.split("@")[0]} ` : "";
  const aviso = removida
    ? `🛡️ ${mencao}${motivo} A mensagem foi removida.`
    : `🛡️ ${mencao}${motivo} Para remover mensagens, o bot precisa ser administrador do grupo.`;
  const opcoes = { text: aviso };
  if (senderJid) opcoes.mentions = [senderJid];
  try {
    await sock.sendMessage(from, opcoes);
  } catch (erro) {
    console.warn("Não foi possível enviar o aviso da proteção.");
  }
}

async function iniciarBot() {
  const SEED_VERSAO = 6;
  if ((db.iaSemeadaVersao || 0) < SEED_VERSAO) {
    FRASES_SEMENTE.forEach((frase) => aprender(frase));
    db.iaSemeadaVersao = SEED_VERSAO;
    salvar();
    console.log(`🧠 IA semeada com ${FRASES_SEMENTE.length} frases iniciais (versão ${SEED_VERSAO}).`);
  }

  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    browser: ["Meu Bot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("\n📱 Escaneie o QR code abaixo no WhatsApp:\n");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "close") {
      const motivo = lastDisconnect?.error?.output?.statusCode;
      const deveReconectar = motivo !== DisconnectReason.loggedOut;
      console.log("❌ Conexão fechada.", motivo, "Reconectar?", deveReconectar);
      if (deveReconectar) iniciarBot();
      else console.log("🔒 Sessão encerrada. Apague auth_info e rode de novo para reconectar.");
    } else if (connection === "open") {
      console.log("✅ Bot conectado com sucesso!");
    }
  });

  sock.ev.on("group-participants.update", async (evento) => {
    try {
      const grupo = pegarGrupo(evento.id);
      if (!grupo.autorizado || !grupo.boasVindas || !db.botLigado) return;
      if (evento.action === "add") {
        for (const participante of evento.participants) {
          const legenda = `👋 Seja bem-vindo(a), @${participante.split("@")[0]}! Leia as regras com !verregras e aproveite o grupo.`;
          try {
            const imagem = await gerarImagemBoasVindas({ nome: "Novo membro", grupo: "nosso grupo" });
            await sock.sendMessage(evento.id, { image: imagem, caption: legenda, mentions: [participante] });
          } catch (erroImagem) {
            console.error("Erro ao gerar o cartão de boas-vindas:", erroImagem.message);
            await sock.sendMessage(evento.id, { text: legenda, mentions: [participante] });
          }
        }
      }
    } catch (erro) {
      console.error("Erro no evento de boas-vindas:", erro);
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const from = msg.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      const senderJid = isGroup ? msg.key.participant : from;
      const nomeUsuario = msg.pushName || "Usuário";

      if (isGroup) {
        const grupoSeguranca = pegarGrupo(from);
        if (grupoSeguranca.autorizado && grupoSeguranca.antiTravaZap) {
          const risco = analisarTravazap(msg);
          if (risco) {
            await removerMensagemProtegida(
              sock,
              from,
              msg,
              senderJid,
              "Mensagem bloqueada pelo anti-trava-zap."
            );
            return;
          }
        }
      }

      const texto = extrairTexto(msg);
      const temImagem = detectarImagem(msg);

      // Processa respostas de botões interativos
      const respostaBotao = extrairRespostaBotao(msg);
      const textoComando = respostaBotao || texto;

      if (!textoComando && !temImagem) return;

      if (db.usuarios[senderJid]?.banido) return;

      if (db.manutencao?.ativa && !ehDono(senderJid, NUMEROS_DONO)) {
        if (textoComando.startsWith(PREFIX)) {
          await sock.sendMessage(from, { text: db.manutencao.mensagem || "🔧 Bot em manutenção, volta já!" });
        }
        return;
      }

      if (isGroup) {
        const grupo = pegarGrupo(from);
        const ehComandoDeAutorizacao = textoComando.startsWith(PREFIX) &&
          ["autorizargrupo", "desautorizargrupo", "ligarbot", "desligarbot"].includes(textoComando.slice(1).trim().split(/\s+/)[0].toLowerCase());

        if (!grupo.autorizado && !ehComandoDeAutorizacao) return;
        if (!db.botLigado && !ehComandoDeAutorizacao) return;

        if (grupo.mutados.includes(senderJid)) {
          try { await sock.sendMessage(from, { delete: msg.key }); } catch (erro) {}
          return;
        }

        if (grupo.antiNsfw && textoComando && detectarTextoNsfw(textoComando)) {
          const adminOuDono = ehDono(senderJid, NUMEROS_DONO) || await ehAdminDoGrupo(sock, from, senderJid);
          if (!adminOuDono) {
            await removerMensagemProtegida(
              sock,
              from,
              msg,
              senderJid,
              "Conteúdo explícito detectado pelo anti-NSFW."
            );
            return;
          }
        }

        if (grupo.antilink && REGEX_LINK.test(textoComando) && !ehDono(senderJid, NUMEROS_DONO)) {
          const admin = await ehAdminDoGrupo(sock, from, senderJid);
          if (!admin) {
            try {
              await sock.sendMessage(from, { delete: msg.key });
              await sock.sendMessage(from, { text: `🔗🚫 Link removido de @${senderJid.split("@")[0]} (antilink ativo).`, mentions: [senderJid] });
            } catch (erro) {}
            return;
          }
        }
      } else if (!db.botLigado) {
        return;
      }

      const { usuario: usuarioAtual } = darXpPorMensagem(senderJid, nomeUsuario);
      registrarProgressoMissao(usuarioAtual, "mensagens");
      salvar();
      if (usuarioAtual.afk) {
        usuarioAtual.afk = false;
        usuarioAtual.afkMotivo = "";
        salvar();
        await sock.sendMessage(from, { text: `👋 Bem-vindo(a) de volta, ${usuarioAtual.nome}! Removi seu status AFK.` });
      }

      await entregarRecados(sock, senderJid);

      const mencionados = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      for (const jid of mencionados) {
        const alvo = db.usuarios[jid];
        if (alvo?.afk) {
          const minutos = Math.floor((Date.now() - alvo.afkDesde) / 60000);
          await sock.sendMessage(from, { text: `💤 ${alvo.nome} está AFK há ${minutos} min: ${alvo.afkMotivo}` });
        }
      }

      // Comandos (inclui respostas de botões)
      if (textoComando.startsWith(PREFIX)) {
        const [comandoBruto, ...args] = textoComando.slice(PREFIX.length).trim().split(/\s+/);
        const comando = comandoBruto.toLowerCase();
        await tratarComando({ sock, from, msg, comando, args, isGroup, senderJid, nomeUsuario });
        return;
      }

      // IA: aceita gatilho no texto OU na legenda da imagem
      const grupoAtual = isGroup ? pegarGrupo(from) : { iaAtiva: true };
      if (grupoAtual.iaAtiva) {
        if (texto) aprender(texto);

        const temGatilho = REGEX_GATILHO_IA.test(texto || "") || (temImagem && REGEX_GATILHO_IA.test(texto || ""));
        const aceitaImagemSemTexto = temImagem && !texto;

        if (temGatilho || aceitaImagemSemTexto) {
          let imagemBase64 = null;
          let mimeType = null;
          if (temImagem) {
            try {
              const buffer = await downloadMediaMessage(
                msg, "buffer", {},
                { logger: pino({ level: "silent" }), reuploadRequest: sock.updateMediaMessage }
              );
              imagemBase64 = buffer.toString("base64");
              mimeType = detectarMimeType(msg);
              console.log(`🖼️ Imagem recebida (${Math.round(buffer.length / 1024)} KB, ${mimeType})`);
            } catch (e) {
              console.error("Falha ao baixar imagem:", e.message);
            }
          }

          const historico = pegarHistorico(from, senderJid, 10);
          let contexto = "";
          try {
            contexto = await montarContexto(sock, from, senderJid, nomeUsuario);
          } catch (e) {
            contexto = `Conversando com ${nomeUsuario} no WhatsApp.`;
          }

          const resposta = await responderIA(texto || "", senderJid, {
            historico,
            contexto,
            imagemBase64,
            mimeType,
          });

          if (resposta) {
            const textoResposta = typeof resposta === "string" ? resposta : resposta.texto;
            const mencionar = typeof resposta === "string" ? [] : (resposta.mencionar || []);

            await sock.sendMessage(from, {
              text: textoResposta,
              mentions: mencionar,
            });

            if (texto) adicionarMemoria(from, senderJid, "user", texto.replace(REGEX_GATILHO_IA, "").trim());
            else if (temImagem) adicionarMemoria(from, senderJid, "user", "[imagem enviada]");
            adicionarMemoria(from, senderJid, "assistant", textoResposta);
          }
        }
      }
    } catch (erro) {
      console.error("Erro ao processar mensagem:", erro);
    }
  });
}

function extrairTexto(msg) {
  const m = msg.message;
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ""
  );
}

/**
 * Extrai a resposta de um botão interativo.
 * Suporta: buttonsResponseMessage, listResponseMessage, templateButtonReplyMessage
 */
function extrairRespostaBotao(msg) {
  const m = msg.message;
  if (!m) return null;

  // Resposta de botão simples
  if (m.buttonsResponseMessage?.selectedButtonId) {
    return m.buttonsResponseMessage.selectedButtonId;
  }

  // Resposta de lista
  if (m.listResponseMessage?.singleSelectReply?.selectedRowId) {
    return m.listResponseMessage.singleSelectReply.selectedRowId;
  }

  // Resposta de template button
  if (m.templateButtonReplyMessage?.selectedId) {
    return m.templateButtonReplyMessage.selectedId;
  }

  return null;
}

function detectarImagem(msg) {
  const m = msg.message;
  if (!m) return false;
  if (m.imageMessage) return true;
  if (m.stickerMessage) return true;
  if (m.viewOnceMessage?.message?.imageMessage) return true;
  if (m.viewOnceMessageV2?.message?.imageMessage) return true;
  if (m.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) return false;
  return false;
}

function detectarMimeType(msg) {
  const m = msg.message;
  if (m.imageMessage?.mimetype) return m.imageMessage.mimetype;
  if (m.stickerMessage?.mimetype) return m.stickerMessage.mimetype;
  if (m.viewOnceMessage?.message?.imageMessage?.mimetype) return m.viewOnceMessage.message.imageMessage.mimetype;
  if (m.viewOnceMessageV2?.message?.imageMessage?.mimetype) return m.viewOnceMessageV2.message.imageMessage.mimetype;
  return "image/jpeg";
}

async function tratarComando(ctx) {
  const { sock, from, comando, senderJid, isGroup } = ctx;

  if (!TODOS_COMANDOS[comando]) {
    await sock.sendMessage(from, { text: `❓ Comando não reconhecido. Digite ${PREFIX}menu para ver os comandos.` });
    return;
  }

  if (COMANDOS_SOMENTE_DONO.has(comando) && !ehDono(senderJid, NUMEROS_DONO)) {
    await sock.sendMessage(from, { text: "⛔ Esse comando é só para o dono do bot." });
    return;
  }

  if (COMANDOS_ADMIN_GRUPO.has(comando)) {
    const dono = ehDono(senderJid, NUMEROS_DONO);
    if (!dono) {
      if (!isGroup) {
        await sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
        return;
      }
      const admin = await ehAdminDoGrupo(sock, from, senderJid);
      if (!admin) {
        await sock.sendMessage(from, { text: "⛔ Esse comando é só para admins do grupo (ou o dono do bot)." });
        return;
      }
    }
  }

  await TODOS_COMANDOS[comando](ctx);
  if (COMANDOS_MINIJOGOS.has(comando)) {
    const usuario = pegarUsuario(senderJid, ctx.nomeUsuario);
    registrarProgressoMissao(usuario, "jogos");
    salvar();
  }
}

const COMANDOS_MINIJOGOS = new Set([
  "dado", "moeda", "ppt", "quiz", "enigma", "anagrama", "resposta", "matematica",
  "termo", "enforcado", "adivinhenumero", "slots", "bicho", "apostar", "roleta",
  "corrida", "futebol", "basquete", "copa", "penalti", "penaltis",
]);

iniciarBot();
