/**
 * Handlers de comandos — Miku 5.0
 * Inclui: botões interativos, sistema de pets, batalhas por golpes,
 * batalha entre membros, batalha entre monstros, batalha dinâmica com botões,
 * shipp melhorado (duas pessoas), copa dinâmica (escolher times),
 * perfil melhorado (texto + imagem personalizada), música otimizada.
 */

const { db, salvar, pegarUsuario, pegarGrupo } = require("./db");
const { xpParaNivel, darXpPorMensagem } = require("./xp");
const { PIADAS, MEMES_TEXTO, SORTES, DESAFIOS, PREVISOES, LOJA, FATOS_ALEATORIOS, MOLDURAS } = require("./conteudo");
const { criarFigurinha } = require("./figurinha");
const { figurinhaParaImagem, pretoEBranco, espelhar, extrairAudio } = require("./midiaEdicao");
const {
  buscarMusicas,
  baixarAudioBuffer,
  buscarEBaixar,
  aplicarBassBoost,
  aplicarNightcore,
  aplicarSlowed,
  aplicar8D,
} = require("./musica");
const { enviarComMidiaAleatoria } = require("./midia");
const { animarCarregamento } = require("./carregamento");
const { aprender, gerarFrase, tamanhoDoConhecimento, tamanhoDoVocabulario } = require("./aprendizado");
const { pesquisar } = require("./pesquisa");
const {
  gerarImagemPlacar, gerarImagemShipp, gerarImagemTermo, gerarImagemRPG, gerarImagemPerfil, gerarImagemPet,
  salvarFotoPerfil, carregarFotoPerfil, removerFotoPerfil,
} = require("./imagem");
const {
  CLASSES_RPG, MONSTROS, LOJA_RPG, PETS_DISPONIVEIS, PET_PODERES,
  criarPersonagem, criarPet, cuidarPet, alimentarPet, curarPet, brincarPet, treinarPet, ganharXpPet,
  sortearMonstro, batalhar, ganharXp,
  iniciarBatalhaGolpes, executarGolpe,
  batalharMembros, batalharMonstros,
  iniciarBatalhaDinamica, obterBatalhaDinamica, encerrarBatalhaDinamica, acaoBatalhaDinamica,
} = require("./rpg");
const { ANIMES, FRASES_ESTILO_ANIME, PERSONAGENS } = require("./conteudoAnime");
const { CONSELHOS, RESPOSTAS_ORACULO, VERDADES, DESAFIOS_VD, SIGNOS, NOMES_FANTASIA, CITACOES } = require("./conteudoExtra");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const {
  listarMissoes,
  registrarProgressoMissao,
  resgatarMissoes,
  resgatarBonusDiario,
} = require("./sistemas");

const NOME_BOT = "Hatsune Miku";

let numerosDonoExibicao = [];
function definirNumeroDonoExibicao(numeros) {
  numerosDonoExibicao = Array.isArray(numeros) ? numeros : [numeros];
}

const lembretesAtivos = [];
const recadosPendentes = {};
const horaLigado = Date.now();
const desafiosMatematica = {};
const ultimoAudioPorChat = {};
const jogosTermo = {};
const PALAVRAS_TERMO = [
  "carro", "festa", "ponte", "dente", "balde", "gente", "porta", "fruta",
  "vidro", "pedra", "noite", "calor", "verde", "corpo", "filho", "tempo",
  "mundo", "campo", "nuvem", "chuva", "praia", "trigo", "vento", "torre",
  "leite", "texto", "sonho", "prato", "lenha", "barco",
];
const jogosForca = {};
const PALAVRAS_FORCA = [
  { palavra: "computador", categoria: "Tecnologia" },
  { palavra: "elefante", categoria: "Animais" },
  { palavra: "biblioteca", categoria: "Lugares" },
  { palavra: "montanha", categoria: "Natureza" },
  { palavra: "borboleta", categoria: "Animais" },
  { palavra: "telefone", categoria: "Tecnologia" },
  { palavra: "chocolate", categoria: "Comida" },
  { palavra: "guitarra", categoria: "Musica" },
  { palavra: "floresta", categoria: "Natureza" },
  { palavra: "aeroporto", categoria: "Lugares" },
  { palavra: "hamburguer", categoria: "Comida" },
  { palavra: "bateria", categoria: "Musica" },
];
const DESENHOS_FORCA = [
  "☠️ ┌──┐\n   │  😵\n  ─┼─\n  / \\\n══╧══",
  "  ┌──┐\n   │  😖\n  ─┼─\n  /\n══╧══",
  "  ┌──┐\n   │  😟\n  ─┼─\n══╧══",
  "  ┌──┐\n   │  😕\n   │\n══╧══",
  "  ┌──┐\n   │  🙂\n══╧══",
  "  ┌──┐\n   │\n══╧══",
  "══════",
];
const pedidosCasamento = {};
const jogosAdivinhacao = {};
const BICHOS = [
  "🐘 Elefante", "🦁 Leão", "🦒 Girafa", "🐒 Macaco", "🦓 Zebra",
  "🐢 Tartaruga", "🐍 Cobra", "🐫 Camelo", "🐇 Coelho", "🐖 Porco",
  "🐄 Vaca", "🐐 Cabra", "🦅 Águia", "🦉 Coruja", "🐓 Galo",
  "🐟 Peixe", "🦈 Tubarão", "🐬 Golfinho", "🐺 Lobo", "🦊 Raposa",
  "🐻 Urso", "🐼 Panda", "🐯 Tigre", "🦌 Veado", "🐴 Cavalo",
];

function escolher(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

function chaveDoJogo(from, senderJid) {
  return `${from}:${senderJid}`;
}

function normalizarRespostaJogo(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pegarMencionados(msg) {
  return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
}

function resolverMsgAlvo(msg, from) {
  const contexto = msg.message?.extendedTextMessage?.contextInfo;
  const citada = contexto?.quotedMessage;
  if (!citada) return msg;
  return {
    key: { remoteJid: from, id: contexto.stanzaId, participant: contexto.participant },
    message: citada,
  };
}

function avaliarPalpiteTermo(palavra, alvo) {
  const resultado = new Array(alvo.length).fill(null);
  const usados = new Array(alvo.length).fill(false);
  for (let i = 0; i < palavra.length; i++) {
    if (palavra[i] === alvo[i]) { resultado[i] = { letra: palavra[i], cor: "verde" }; usados[i] = true; }
  }
  for (let i = 0; i < palavra.length; i++) {
    if (resultado[i]) continue;
    const idx = alvo.split("").findIndex((letra, j) => letra === palavra[i] && !usados[j]);
    if (idx !== -1) { resultado[i] = { letra: palavra[i], cor: "amarelo" }; usados[idx] = true; }
    else { resultado[i] = { letra: palavra[i], cor: "cinza" }; }
  }
  return resultado;
}

function linhaTermoParaEmoji(linha) {
  const mapa = { verde: "🟩", amarelo: "🟨", cinza: "⬛" };
  return linha.map((c) => mapa[c.cor]).join("");
}

function resumoLetrasTermo(historico) {
  const prioridade = { verde: 3, amarelo: 2, cinza: 1 };
  const mapa = { verde: "🟩", amarelo: "🟨", cinza: "⬛" };
  const status = {};
  for (const linha of historico) {
    for (const { letra, cor } of linha) {
      if (!status[letra] || prioridade[cor] > prioridade[status[letra]]) status[letra] = cor;
    }
  }
  const letras = Object.keys(status).sort();
  return "Letras: " + letras.map((l) => `${l.toUpperCase()}${mapa[status[l]]}`).join(" ");
}

const NUMERO_SHIPP_100 = "558183983567";

function gerarMedidor(nomeExibido, tipo, emoji) {
  const porcentagem = Math.floor(Math.random() * 101);
  const preenchido = Math.round(porcentagem / 10);
  const barra = "▰".repeat(preenchido) + "▱".repeat(10 - preenchido);
  return `${emoji} *Medidor de ${tipo}*\n${nomeExibido}: ${porcentagem}%\n${barra}`;
}

async function obterAudioAlvo(msg, from) {
  const contexto = msg.message?.extendedTextMessage?.contextInfo;
  const citada = contexto?.quotedMessage;
  if (citada?.audioMessage) {
    const msgAlvo = {
      key: { remoteJid: from, id: contexto.stanzaId, participant: contexto.participant },
      message: citada,
    };
    return downloadMediaMessage(msgAlvo, "buffer", {});
  }
  return ultimoAudioPorChat[from] || null;
}

function cabecalhoMenu(nomeUsuario, tituloUsuario, subtitulo) {
  const distintivo = tituloUsuario || "🔹 Membro";
  return (
    `┇👤 *${nomeUsuario}*\n` +
    `┇${distintivo}\n\n` +
    `═⋆｡‧₊°♱༺𓆩🩵𓆪༻♱༉‧₊═\n` +
    `   *${NOME_BOT}* — ${subtitulo}\n` +
    `═⋆｡‧₊°♱༺𓆩🩵𓆪༻♱༉‧₊═\n\n`
  );
}

function linha(emoji, texto) {
  return `┇𝓐ᥫ᭡${emoji} ~| ${texto}\n`;
}

function rodapeMenu() {
  return `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n${NOME_BOT} 🩵   ═⋆｡‧₊°♱༺𓆩🩵𓆪༻♱༉‧₊═`;
}

// Helper para enviar botões interativos
async function enviarComBotoes(sock, from, texto, botoes, titulo = NOME_BOT) {
  try {
    const botoesFormatados = botoes.map((b) => ({
      buttonId: b.id,
      buttonText: { displayText: b.texto },
      type: 1,
    }));
    await sock.sendMessage(from, {
      text: texto,
      buttons: botoesFormatados,
      headerType: 1,
    });
  } catch (erro) {
    // Fallback: envia texto simples se botões falharem
    const textoBotoes = botoes.map((b) => `▸ ${b.texto}`).join("\n");
    await sock.sendMessage(from, { text: `${texto}\n\n${textoBotoes}` });
  }
}

// Helper para enviar lista interativa
async function enviarLista(sock, from, titulo, descricao, lista, textoRodape) {
  try {
    const secoes = [{
      title: titulo,
      rows: lista.map((item) => ({
        rowId: item.id,
        title: item.titulo,
        description: item.descricao || "",
      })),
    }];
    await sock.sendMessage(from, {
      text: descricao,
      sections: secoes,
      buttonText: "📋 Ver opções",
      title: titulo,
      footer: textoRodape || NOME_BOT,
    });
  } catch (erro) {
    const textoLista = lista.map((item) => `▸ ${item.titulo}${item.descricao ? ` — ${item.descricao}` : ""}`).join("\n");
    await sock.sendMessage(from, { text: `${descricao}\n\n${textoLista}` });
  }
}

async function ehAdminDoGrupo(sock, groupJid, userJid) {
  try {
    const metadata = await sock.groupMetadata(groupJid);
    const participante = metadata.participants.find((p) => p.id === userJid);
    return participante?.admin === "admin" || participante?.admin === "superadmin";
  } catch {
    return false;
  }
}

function ehDono(userJid, numerosDono) {
  if (!numerosDono) return false;
  const lista = Array.isArray(numerosDono) ? numerosDono : [numerosDono];
  return lista.some((numero) => numero && userJid.startsWith(numero));
}

// ===================== TIMES E ESPORTES =====================

const TIMES_ESPORTE = [
  "🦁 Leões", "🐺 Lobos", "🦅 Águias", "🐉 Dragões", "⚡ Raios", "🔥 Fênix",
  "🐯 Tigres", "🦈 Tubarões", "🐴 Cavalos", "🦊 Raposas", "🐱 Gatos",
  "🏔️ Bergen", "⚪ Real Madrid", "🔴 Flamengo", "🔵 Chelsea", "⚫ Juventus",
  "🟡 Borussia", "🔴 Liverpool", "🔵 PSG", "🟢 Palmeiras", "⚪ Corinthians",
];

const NOMES_JOGADORES = [
  "Silva", "Rocha", "Almeida", "Costa", "Pereira", "Martins", "Ferreira",
  "Souza", "Ramos", "Lima", "Cardoso", "Teixeira", "Nogueira", "Barros",
];

function disputaPenaltis(timeA, timeB) {
  function cobrarRodada() { return Math.random() < 0.75; }
  let colocA = 0, colocB = 0;
  const linhas = [];
  for (let rodada = 1; rodada <= 5; rodada++) {
    const golA = cobrarRodada();
    const golB = cobrarRodada();
    if (golA) colocA++;
    if (golB) colocB++;
    linhas.push(`${rodada}ª: ${timeA.split(" ")[0]}${golA ? "⚽" : "❌"}  ${timeB.split(" ")[0]}${golB ? "⚽" : "❌"}`);
  }
  while (colocA === colocB) {
    const golA = cobrarRodada();
    const golB = cobrarRodada();
    if (golA) colocA++;
    if (golB) colocB++;
    linhas.push(`Extra: ${timeA.split(" ")[0]}${golA ? "⚽" : "❌"}  ${timeB.split(" ")[0]}${golB ? "⚽" : "❌"}`);
  }
  return { colocA, colocB, resumo: linhas.join("\n"), vencedor: colocA > colocB ? timeA : timeB };
}

// ===================== COMANDOS GERAIS =====================

const geral = {
  async diario({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const resultado = resgatarBonusDiario(usuario);
    if (!resultado.resgatado) {
      return sock.sendMessage(from, {
        text: `Você já resgatou seu bônus de hoje. Sequência atual: ${resultado.sequencia} dia(s). Volte amanhã.`,
      });
    }
    salvar();
    await sock.sendMessage(from, {
      text: `🎁 Bônus diário recebido: +${resultado.moedas} moedas.\n🔥 Sequência: ${resultado.sequencia} dia(s).\nSaldo: ${usuario.moedas} 🪙`,
    });
  },

  async missao({ sock, from, args, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if ((args[0] || "").toLowerCase() === "resgatar") {
      const resultado = resgatarMissoes(usuario);
      if (resultado.tarefas.length === 0) {
        return sock.sendMessage(from, { text: "Ainda não há missão concluída para resgatar." });
      }
      salvar();
      return sock.sendMessage(from, {
        text: `🏅 Missões resgatadas: ${resultado.tarefas.map((tarefa) => tarefa.nome).join(", ")}.\n+${resultado.moedas} 🪙 | Saldo: ${usuario.moedas} 🪙`,
      });
    }

    const tarefas = listarMissoes(usuario);
    const linhas = tarefas.map((tarefa) => {
      const estado = tarefa.resgatada ? "✅ Resgatada" : `${tarefa.progresso}/${tarefa.alvo}`;
      return `${tarefa.progresso >= tarefa.alvo ? "🏁" : "▫️"} ${tarefa.nome}: ${estado} — +${tarefa.moedas} 🪙`;
    });
    await sock.sendMessage(from, {
      text: `📋 *MISSÕES DE HOJE*\n\n${linhas.join("\n")}\n\nUse !missao resgatar quando concluir uma ou mais.`,
    });
  },

  async menu({ sock, from, senderJid, nomeUsuario }) {
    await animarCarregamento(sock, from, "🩵 Carregando menu", 2, 300);
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "MENU DA BOT") +
      linha("🩵", "!menuadm") +
      linha("🌍", "!menuinfo") +
      linha("🎯", "!menuutil") +
      linha("😜", "!menufun") +
      linha("⚔️", "!menugp") +
      linha("🐉", "!menuanime") +
      linha("🎮", "!menujogos") +
      linha("📦", "!menubaixar") +
      linha("🎬", "!menumidia") +
      linha("💎", "!menuvip") +
      linha("👑", "!menudono") +
      linha("🗡️", "!menurpg") +
      linha("🐾", "!menupet") +
      linha("⚔️", "!menubatalha") +
      linha("☠️", "!menuajuda") +
      rodapeMenu();

    // Menu principal com botões de acesso rápido (máx 3 botões)
    await enviarComBotoes(sock, from, texto, [
      { id: "!menujogos", texto: "🎮 Jogos" },
      { id: "!menurpg", texto: "🗡️ RPG" },
      { id: "!menupet", texto: "🐾 Pets" },
    ]);
  },

  async menuadm({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "AUTORIZACAO E IA") +
      linha("🔐", "!autorizargrupo") +
      linha("🔓", "!desautorizargrupo") +
      linha("🧠", "!iaativar") +
      linha("🧠", "!iadesativar") +
      linha("📚", "!ialearn <frase>") +
      linha("🗣️", "!iafala [tema]") +
      linha("📊", "!iainfo") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menuinfo({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "INFORMACOES") +
      linha("🏓", "!ping") +
      linha("⏱️", "!uptime") +
      linha("🕒", "!hora") +
      linha("👤", "!perfil [@user]") +
      linha("🏆", "!rankxp") +
      linha("💬", "!ranking") +
      linha("💰", "!top") +
      linha("🎁", "!diario") +
      linha("📋", "!missao [resgatar]") +
      linha("🆔", "!meujid") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menuutil({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "UTILIDADES") +
      linha("🔁", "!eco <texto>") +
      linha("🧮", "!calcular <expressao>") +
      linha("⏰", "!lembrar <minutos> <msg>") +
      linha("📩", "!recado @user <msg>") +
      linha("🔐", "!senha [tamanho]") +
      linha("🚨", "!denunciar <motivo>") +
      linha("🎉", "!sorteio @user1 @user2...") +
      linha("🔎", "!pesquisar <assunto>") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menufun({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "BRINCADEIRAS") +
      linha("😂", "!piada") +
      linha("🗿", "!meme") +
      linha("🔮", "!sorte") +
      linha("🎯", "!desafio") +
      linha("🔮", "!previsao") +
      linha("💀", "!kill @user") +
      linha("✨", "!reviver @user") +
      linha("💤", "!afk <motivo>") +
      linha("💅", "!beleza [@user]") +
      linha("🧠", "!inteligencia [@user]") +
      linha("🍀", "!sortemetro [@user]") +
      linha("💪", "!forca [@user]") +
      linha("😎", "!carisma [@user]") +
      linha("💘", "!shipp @p1 @p2") +
      linha("💍", "!casar @user") +
      linha("💔", "!divorciar") +
      linha("💞", "!trisal @user1 @user2") +
      linha("💞", "!quadrisal @user1 @user2 @user3") +
      linha("🤖", "!casarbot @user") +
      linha("💔", "!divorciarbot") +
      linha("📝", "!definirbio <texto>") +
      linha("🎨", "!molduras") +
      linha("💳", "!comprarmoldura <id>") +
      linha("🔮", "!oraculo <pergunta>") +
      linha("💡", "!conselho") +
      linha("📜", "!citacao") +
      linha("🎤", "!rimas <tema>") +
      linha("🧙", "!gerarnome") +
      linha("♈", "!horoscopo <signo>") +
      linha("🧠", "!fatoaleatorio") +
      linha("🎭", "!emoji") +
      linha("🔢", "!contador") +
      linha("🎨", "!desenhoascii") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menugp({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "MODERACAO DE GRUPO") +
      linha("🥾", "!remover @user") +
      linha("🔒", "!fechargrupo") +
      linha("🔓", "!abrirgrupo") +
      linha("🔇", "!mutar @user") +
      linha("🔊", "!desmutar @user") +
      linha("⚠️", "!avisar @user <motivo>") +
      linha("⬆️", "!promover @user") +
      linha("⬇️", "!rebaixar @user") +
      linha("🔗", "!antilink") +
      linha("📣", "!marcartodos <aviso>") +
      linha("🔗", "!grupolink") +
      linha("🔄", "!revogarlink") +
      linha("🗑️", "!apagar (responda a msg)") +
      linha("✏️", "!definirnome <nome>") +
      linha("📝", "!definirdescricao <texto>") +
      linha("👋", "!boasvindas") +
      linha("📜", "!regras <texto>") +
      linha("📖", "!verregras") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menuanime({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "ANIME") +
      linha("🐉", "!animerandom") +
      linha("💬", "!frase") +
      linha("🎭", "!personagem") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menujogos({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "JOGOS") +
      linha("🎲", "!dado") +
      linha("🪙", "!moeda") +
      linha("✊", "!ppt <pedra/papel/tesoura>") +
      linha("🧩", "!quiz / !enigma / !anagrama") +
      linha("🎰", "!roleta") +
      linha("🏁", "!corrida") +
      linha("⚽", "!futebol [Time A | Time B]") +
      linha("🧮", "!matematica") +
      linha("✅", "!resposta <resp>") +
      linha("🎲", "!apostar <valor>") +
      linha("🟩", "!termo") +
      linha("🧩", "!enigma") +
      linha("🔤", "!anagrama") +
      linha("🪓", "!enforcado <letra>") +
      linha("🎰", "!slots <aposta>") +
      linha("🐾", "!bicho <numero> [aposta]") +
      linha("🔢", "!adivinhenumero <numero>") +
      linha("🏀", "!basquete [Time A | Time B]") +
      linha("🥅", "!penalti <esquerda/meio/direita>") +
      linha("🏆", "!copa [time1 | time2 | ...]") +
      linha("🎲", "!verdadeoudesafio <verdade/desafio>") +
      linha("🎁", "!diario | !missao") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menubaixar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "DOWNLOADS") +
      linha("🎵", "!play <nome da musica>") +
      linha("🔊", "!bass") +
      linha("⏫", "!nightcore") +
      linha("⏬", "!slowed") +
      linha("🎧", "!oitod") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menumidia({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "MIDIA") +
      linha("🖼️", "!figurinha (responda uma midia)") +
      linha("🔄", "!toimg (responda uma figurinha)") +
      linha("⚫⚪", "!pretobranco") +
      linha("🪞", "!espelhar") +
      linha("🎧", "!extrairaudio (responda um video)") +
      linha("📊", "!enquete Pergunta | op1 | op2") +
      linha("📸", "!fotoperfil [@user]") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menuvip({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "LOJA VIP") +
      linha("🛒", "!loja") +
      linha("💎", "!comprar <id>") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menudono({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "DONO DO BOT") +
      linha("🟢", "!ligarbot") +
      linha("🔴", "!desligarbot") +
      linha("👑", "!dono") +
      linha("📢", "!transmitir <mensagem>") +
      linha("📊", "!stats") +
      linha("♻️", "!resetuser @user") +
      linha("💰", "!addmoedas @user <qtd>") +
      linha("💸", "!removermoedas @user <qtd>") +
      linha("📈", "!setnivel @user <nivel>") +
      linha("💎", "!addvip @user") +
      linha("🚫", "!removervip @user") +
      linha("🔨", "!banir @user") +
      linha("✅", "!desbanir @user") +
      linha("📋", "!listagrupos") +
      linha("👑", "!listadonos") +
      linha("🔧", "!manutencao <mensagem>") +
      linha("ℹ️", "!versao") +
      linha("🔄", "!reiniciar") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menurpg({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "MODO RPG") +
      linha("🗡️", "!rpgcriar <nome> <classe>") +
      linha("📜", "!rpgperfil") +
      linha("⚔️", "!rpgbatalhar") +
      linha("💚", "!rpgcurar") +
      linha("🛒", "!rpgloja") +
      linha("💰", "!rpgcomprar <id>") +
      linha("🏆", "!rpgranking") +
      linha("♻️", "!rpgresetar") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menupet({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "SISTEMA DE PETS") +
      linha("🐾", "!petadotar <tipo> <nome>") +
      linha("📋", "!petperfil") +
      linha("🍖", "!petalimentar") +
      linha("💚", "!petcurar") +
      linha("🎾", "!petbrincar") +
      linha("💪", "!pettreinar") +
      linha("⚔️", "!petbatalhar") +
      linha("✏️", "!petrenomear <novo nome>") +
      linha("💔", "!petabandonar") +
      linha("📋", "!petlista (ver pets disponiveis)") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menubatalha({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "BATALHAS") +
      linha("⚔️", "!batalhagolpes — Batalha por golpes (RPG)") +
      linha("👥", "!batalhamembros @p1 @p2 — Membro vs Membro") +
      linha("🐉", "!batalhamonstros — Monstro vs Monstro") +
      linha("🎮", "!batalhadinamica — Batalha com botoes") +
      linha("🎯", "!rpgacao <poder> — Acao na batalha dinamica") +
      linha("🏃", "!fugirbatalha — Fugir da batalha dinamica") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async menuajuda({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const texto =
      cabecalhoMenu(usuario.nome, usuario.titulo, "AJUDA") +
      linha("❕", "Todos os comandos comecam com !") +
      linha("💡", "Ex: !menu, !ping, !figurinha") +
      linha("🧠", "IA: digite 'kok' ou 'miku' para falar comigo") +
      linha("👑", "Duvidas? Fala com o !dono do bot") +
      rodapeMenu();
    await sock.sendMessage(from, { text: texto });
  },

  async ping({ sock, from }) {
    await sock.sendMessage(from, { text: "🏓 Pong! Bot online." });
  },

  async uptime({ sock, from }) {
    const segundos = Math.floor((Date.now() - horaLigado) / 1000);
    const h = Math.floor(segundos / 3600);
    const min = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    await sock.sendMessage(from, { text: `⏱️ Ligado há ${h}h ${min}m ${s}s` });
  },

  async hora({ sock, from }) {
    await sock.sendMessage(from, { text: `🕒 ${new Date().toLocaleString("pt-BR")}` });
  },

  async eco({ sock, from, args }) {
    await sock.sendMessage(from, { text: args.join(" ") || "Digite algo depois do !eco" });
  },

  async calcular({ sock, from, args }) {
    const expressao = args.join(" ");
    if (!expressao) return sock.sendMessage(from, { text: "Use: !calcular 2 + 2 * 10" });
    if (!/^[0-9+\-*/().\s]+$/.test(expressao)) {
      return sock.sendMessage(from, { text: "Só posso calcular expressões com números e + - * / ( )." });
    }
    try {
      const resultado = Function(`"use strict"; return (${expressao})`)();
      await sock.sendMessage(from, { text: `🧮 ${expressao} = ${resultado}` });
    } catch {
      await sock.sendMessage(from, { text: "Expressão inválida." });
    }
  },

  async enquete({ sock, from, args }) {
    const textoCompleto = args.join(" ");
    const partes = textoCompleto.split("|").map((p) => p.trim()).filter(Boolean);
    if (partes.length < 2) {
      return sock.sendMessage(from, { text: 'Use: !enquete Pergunta aqui | opção 1 | opção 2 | opção 3' });
    }
    const [pergunta, ...opcoes] = partes;
    await sock.sendMessage(from, {
      poll: { name: pergunta, values: opcoes.slice(0, 12), selectableCount: 1 },
    });
  },

  async figurinha({ sock, from, msg }) {
    const msgAlvo = resolverMsgAlvo(msg, from);
    const temMidia = msgAlvo.message?.imageMessage || msgAlvo.message?.videoMessage;
    if (!temMidia) {
      return sock.sendMessage(from, {
        text: "Envie uma imagem/vídeo com !figurinha na legenda, ou responda (reply) a uma mídia com !figurinha.",
      });
    }
    try {
      await animarCarregamento(sock, from, "🖼️ Gerando figurinha", 2, 300);
      const webp = await criarFigurinha(msgAlvo);
      await sock.sendMessage(from, { sticker: webp });
    } catch (erro) {
      console.error("Erro ao criar figurinha:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui gerar a figurinha. Verifique se o ffmpeg está instalado." });
    }
  },

  async toimg({ sock, from, msg }) {
    const msgAlvo = resolverMsgAlvo(msg, from);
    if (!msgAlvo.message?.stickerMessage) {
      return sock.sendMessage(from, { text: "Responda (reply) a uma figurinha com !toimg" });
    }
    try {
      await animarCarregamento(sock, from, "🖼️ Convertendo", 2, 300);
      const buffer = await downloadMediaMessage(msgAlvo, "buffer", {});
      const png = await figurinhaParaImagem(buffer);
      await sock.sendMessage(from, { image: png });
    } catch (erro) {
      console.error("Erro no !toimg:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui converter essa figurinha." });
    }
  },

  async pretobranco({ sock, from, msg }) {
    const msgAlvo = resolverMsgAlvo(msg, from);
    const ehVideo = !!msgAlvo.message?.videoMessage;
    if (!msgAlvo.message?.imageMessage && !ehVideo) {
      return sock.sendMessage(from, { text: "Envie ou responda uma imagem/vídeo com !pretobranco" });
    }
    try {
      await animarCarregamento(sock, from, "⚫⚪ Aplicando filtro", 2, 300);
      const buffer = await downloadMediaMessage(msgAlvo, "buffer", {});
      const resultado = await pretoEBranco(buffer, ehVideo);
      await sock.sendMessage(from, ehVideo ? { video: resultado } : { image: resultado });
    } catch (erro) {
      console.error("Erro no !pretobranco:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui aplicar o filtro." });
    }
  },

  async espelhar({ sock, from, msg }) {
    const msgAlvo = resolverMsgAlvo(msg, from);
    const ehVideo = !!msgAlvo.message?.videoMessage;
    if (!msgAlvo.message?.imageMessage && !ehVideo) {
      return sock.sendMessage(from, { text: "Envie ou responda uma imagem/vídeo com !espelhar" });
    }
    try {
      await animarCarregamento(sock, from, "🪞 Espelhando", 2, 300);
      const buffer = await downloadMediaMessage(msgAlvo, "buffer", {});
      const resultado = await espelhar(buffer, ehVideo);
      await sock.sendMessage(from, ehVideo ? { video: resultado } : { image: resultado });
    } catch (erro) {
      console.error("Erro no !espelhar:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui espelhar essa mídia." });
    }
  },

  async extrairaudio({ sock, from, msg }) {
    const msgAlvo = resolverMsgAlvo(msg, from);
    if (!msgAlvo.message?.videoMessage) {
      return sock.sendMessage(from, { text: "Envie ou responda um vídeo com !extrairaudio" });
    }
    try {
      await animarCarregamento(sock, from, "🎧 Extraindo áudio", 2, 300);
      const buffer = await downloadMediaMessage(msgAlvo, "buffer", {});
      const audio = await extrairAudio(buffer);
      await sock.sendMessage(from, { audio, mimetype: "audio/mp4" });
    } catch (erro) {
      console.error("Erro no !extrairaudio:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui extrair o áudio desse vídeo." });
    }
  },

  async play({ sock, from, args }) {
    const termo = args.join(" ");
    if (!termo) return sock.sendMessage(from, { text: "Use: !play nome da música" });

    try {
      // Busca e baixa em um passo — mais rápido
      const resultado = await buscarEBaixar(termo);
      if (!resultado) return sock.sendMessage(from, { text: "❌ Não encontrei nada com esse nome." });

      await sock.sendMessage(from, { text: `🎵 ${resultado.titulo}${resultado.fromCache ? " (do cache)" : ""}` });
      ultimoAudioPorChat[from] = resultado.buffer;
      await sock.sendMessage(from, { audio: resultado.buffer, mimetype: "audio/mp4" });
    } catch (erro) {
      console.error("Erro no !play:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui baixar essa música agora. Tente outro nome." });
    }
  },

  async musica(ctx) {
    return geral.play(ctx);
  },

  async bass({ sock, from, msg }) {
    try {
      const buffer = await obterAudioAlvo(msg, from);
      if (!buffer) return sock.sendMessage(from, { text: "Toque uma música com !play primeiro, ou responda um áudio com !bass." });
      const resultado = await aplicarBassBoost(buffer);
      await sock.sendMessage(from, { audio: resultado, mimetype: "audio/mp4" });
    } catch (erro) {
      console.error("Erro no !bass:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui aplicar o bass boost. Verifique se o ffmpeg está instalado." });
    }
  },

  async nightcore({ sock, from, msg }) {
    try {
      const buffer = await obterAudioAlvo(msg, from);
      if (!buffer) return sock.sendMessage(from, { text: "Toque uma música com !play primeiro, ou responda um áudio com !nightcore." });
      const resultado = await aplicarNightcore(buffer);
      await sock.sendMessage(from, { audio: resultado, mimetype: "audio/mp4" });
    } catch (erro) {
      console.error("Erro no !nightcore:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui aplicar o efeito." });
    }
  },

  async slowed({ sock, from, msg }) {
    try {
      const buffer = await obterAudioAlvo(msg, from);
      if (!buffer) return sock.sendMessage(from, { text: "Toque uma música com !play primeiro, ou responda um áudio com !slowed." });
      const resultado = await aplicarSlowed(buffer);
      await sock.sendMessage(from, { audio: resultado, mimetype: "audio/mp4" });
    } catch (erro) {
      console.error("Erro no !slowed:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui aplicar o efeito." });
    }
  },

  async oitod({ sock, from, msg }) {
    try {
      const buffer = await obterAudioAlvo(msg, from);
      if (!buffer) return sock.sendMessage(from, { text: "Toque uma música com !play primeiro, ou responda um áudio com !oitod." });
      const resultado = await aplicar8D(buffer);
      await sock.sendMessage(from, { audio: resultado, mimetype: "audio/mp4" });
    } catch (erro) {
      console.error("Erro no !oitod:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui aplicar o efeito." });
    }
  },

  async lembrar({ sock, from, args, senderJid }) {
    const minutos = parseFloat(args[0]);
    const mensagem = args.slice(1).join(" ");
    if (!minutos || minutos <= 0 || !mensagem) {
      return sock.sendMessage(from, { text: "Use: !lembrar <minutos> <mensagem>" });
    }
    if (minutos > 1440) {
      return sock.sendMessage(from, { text: "Máximo de 1440 minutos (24h) por lembrete." });
    }
    await sock.sendMessage(from, { text: `⏰ Lembrete marcado para ${minutos} min: "${mensagem}"` });
    const id = setTimeout(async () => {
      await sock.sendMessage(from, { text: `⏰ *Lembrete!* @${senderJid.split("@")[0]}: ${mensagem}`, mentions: [senderJid] });
    }, minutos * 60 * 1000);
    lembretesAtivos.push(id);
  },

  async denunciar({ sock, from, args, isGroup, nomeUsuario }) {
    const motivo = args.join(" ");
    if (!motivo) return sock.sendMessage(from, { text: "Use: !denunciar <motivo>" });
    if (numerosDonoExibicao.length === 0) {
      return sock.sendMessage(from, { text: "Denúncia registrada, mas o dono do bot ainda não foi configurado." });
    }
    const jidDono = numerosDonoExibicao[0] + "@s.whatsapp.net";
    await sock.sendMessage(jidDono, {
      text: `🚨 *Denúncia recebida*\nDe: ${nomeUsuario}\nOnde: ${isGroup ? "grupo" : "privado"}\nMotivo: ${motivo}`,
    });
    await sock.sendMessage(from, { text: "✅ Denúncia enviada ao dono do bot." });
  },

  async dono({ sock, from }) {
    await sock.sendMessage(from, {
      text: numerosDonoExibicao.length > 0
        ? `👑 Donos deste bot:\n${numerosDonoExibicao.map((n) => `+${n}`).join("\n")}`
        : "O número do dono ainda não foi configurado no index.js.",
    });
  },

  async meujid({ sock, from, senderJid }) {
    await sock.sendMessage(from, { text: `🆔 Seu identificador (JID) é:\n${senderJid}` });
  },

  async verregras({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const grupo = pegarGrupo(from);
    if (!grupo.regras) return sock.sendMessage(from, { text: "Esse grupo ainda não tem regras definidas." });
    await sock.sendMessage(from, { text: `📜 *REGRAS DO GRUPO*\n\n${grupo.regras}` });
  },

  async ialearn({ sock, from, args }) {
    const texto = args.join(" ");
    if (!texto) {
      return sock.sendMessage(from, {
        text: `Use: !ialearn <frase ou texto>\nEnsina algo novo pra IA. Ela já aprendeu ${tamanhoDoConhecimento()} combinações de palavras até agora.`,
      });
    }
    if (texto.split(/\s+/).length < 3) {
      return sock.sendMessage(from, { text: "Manda uma frase com pelo menos 3 palavras pra eu aprender melhor." });
    }
    aprender(texto);
    await sock.sendMessage(from, { text: "🧠 Aprendi! Vou tentar usar isso nas próximas conversas (quando alguém me chamar com \"Kok\")." });
  },

  async iafala({ sock, from, args }) {
    const semente = args.join(" ") || "";
    const frase = gerarFrase(semente || "hoje");
    if (!frase) {
      return sock.sendMessage(from, { text: "Ainda não aprendi o suficiente pra gerar uma frase boa. Usa !ialearn pra me ensinar mais!" });
    }
    await sock.sendMessage(from, { text: `🧠 ${frase.charAt(0).toUpperCase() + frase.slice(1)}` });
  },

  async iainfo({ sock, from }) {
    await sock.sendMessage(from, {
      text: `🧠 *CONHECIMENTO DA IA*\nCombinações aprendidas: ${tamanhoDoConhecimento()}\nPalavras distintas conhecidas: ${tamanhoDoVocabulario()}\nGatilho de resposta: a palavra "Kok" ou "Miku"\nIA 100% local — sem APIs externas\nEnsine mais com !ialearn <frase>`,
    });
  },

  async pesquisar({ sock, from, args }) {
    const termo = args.join(" ");
    if (!termo) return sock.sendMessage(from, { text: "Use: !pesquisar <assunto>" });

    await animarCarregamento(sock, from, `🔎 Pesquisando "${termo}"`, 2, 300);
    const resultado = await pesquisar(termo);
    if (!resultado) {
      return sock.sendMessage(from, { text: "❌ Não encontrei nada sobre isso." });
    }
    aprender(resultado.texto);
    await sock.sendMessage(from, {
      text: `╭──────────────╮\n   🔎 *${resultado.titulo}*\n╰──────────────╯\n${resultado.texto}\n\n_fonte: ${resultado.fonte}_`,
    });
  },

  async sorteio({ sock, from, msg }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length < 2) return sock.sendMessage(from, { text: "Marca pelo menos 2 pessoas: !sorteio @pessoa1 @pessoa2 ..." });
    const vencedor = escolher(mencionados);
    await sock.sendMessage(from, { text: `🎉 O sorteio deu: @${vencedor.split("@")[0]}!`, mentions: mencionados });
  },

  async contador({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    usuario.contador = (usuario.contador || 0) + 1;
    salvar();
    await sock.sendMessage(from, { text: `🔢 Contador de ${usuario.nome}: ${usuario.contador}` });
  },

  async desenhoascii({ sock, from }) {
    const desenhos = [
      "(╯°□°）╯︵ ┻━┻", "ʕ•ᴥ•ʔ", "(¬‿¬)", "(っ◔◡◔)っ ❤", "ヽ(°〇°)ﾉ",
      "(ノಠ益ಠ)ノ彡┻━┻", "(づ｡◕‿‿◕｡)づ", "¯\\_(ツ)_/¯",
    ];
    await sock.sendMessage(from, { text: escolher(desenhos) });
  },

  async fotoperfil({ sock, from, msg, senderJid }) {
    const mencionados = pegarMencionados(msg);
    const alvo = mencionados[0] || senderJid;
    try {
      const url = await sock.profilePictureUrl(alvo, "image");
      await sock.sendMessage(from, { image: { url }, caption: "📸 Foto de perfil" });
    } catch {
      await sock.sendMessage(from, { text: "Não consegui pegar essa foto de perfil (pode estar privada, ou a pessoa não tem foto)." });
    }
  },

  async senha({ sock, from, args }) {
    const tamanho = Math.min(64, Math.max(4, parseInt(args[0], 10) || 12));
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    let resultado = "";
    for (let i = 0; i < tamanho; i++) resultado += caracteres[Math.floor(Math.random() * caracteres.length)];
    await sock.sendMessage(from, { text: `🔐 Senha gerada (${tamanho} caracteres):\n${resultado}` });
  },

  async recado({ sock, from, msg, args, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    const texto = args.filter((a) => !a.startsWith("@")).join(" ");
    if (mencionados.length === 0 || !texto) {
      return sock.sendMessage(from, { text: "Use: !recado @pessoa mensagem" });
    }
    const alvo = mencionados[0];
    if (!recadosPendentes[alvo]) recadosPendentes[alvo] = [];
    recadosPendentes[alvo].push({ de: nomeUsuario, texto, chat: from });
    await sock.sendMessage(from, { text: "✅ Recado guardado! Vou entregar quando a pessoa aparecer por aqui." });
  },
};

async function entregarRecados(sock, senderJid) {
  const pendentes = recadosPendentes[senderJid];
  if (!pendentes || pendentes.length === 0) return;
  delete recadosPendentes[senderJid];
  for (const recado of pendentes) {
    await sock.sendMessage(recado.chat, {
      text: `📩 Recado de ${recado.de} para @${senderJid.split("@")[0]}:\n"${recado.texto}"`,
      mentions: [senderJid],
    });
  }
}

geral.sticker = geral.figurinha;

// ===================== PERFIL E RANKING =====================

const perfil = {
  async perfil({ sock, from, msg, args, senderJid, nomeUsuario }) {
    if ((args[0] || "").toLowerCase() === "editar") {
      return sock.sendMessage(from, {
        text: `🛠️ *EDITAR PERFIL*\n\n!definirbio <texto> — até 80 caracteres\n!definiridade <número>\n!definircidade <cidade>\n!definirstatus <texto>\n!definirfoto — responda a uma imagem\n!molduras — escolha uma moldura\n\nDepois, use !perfil para ver o cartão atualizado.`,
      });
    }
    const mencionados = pegarMencionados(msg);
    const alvoJid = mencionados[0] || senderJid;
    const usuario = alvoJid === senderJid ? pegarUsuario(senderJid, nomeUsuario) : pegarUsuario(alvoJid, undefined);
    if (usuario.nome === alvoJid) usuario.nome = alvoJid.split("@")[0];
    const necessario = xpParaNivel(usuario.nivel);

    let relacionamento = null;
    if (usuario.casadoCom) {
      relacionamento = `💍 Casado(a) com ${pegarUsuario(usuario.casadoCom, undefined).nome}`;
    } else if (usuario.poliRelacao && usuario.poliRelacao.length > 0) {
      const nomes = usuario.poliRelacao.map((jid) => pegarUsuario(jid, undefined).nome).join(", ");
      relacionamento = `💞 Em um ${usuario.poliRelacao.length === 2 ? "trisal" : "quadrisal"} com ${nomes}`;
    }

    const resumoRpg = usuario.rpg ? `${usuario.rpg.emoji} RPG: ${usuario.rpg.classeNome} nível ${usuario.rpg.nivel}` : null;
    const resumoPet = usuario.pet ? `${usuario.pet.emoji} Pet: ${usuario.pet.nome} (Nv.${usuario.pet.nivel})` : null;

    // Carrega foto de perfil personalizada
    const fotoPerfil = carregarFotoPerfil(alvoJid);

    // Texto detalhado para a legenda
    const progresso = Math.min(10, Math.round((usuario.xp / necessario) * 10));
    const barra = "▰".repeat(progresso) + "▱".repeat(10 - progresso);
    let legenda =
      `╭───────────────╮\n   👤 *${usuario.nome}*\n╰───────────────╯\n`;
    if (usuario.titulo) legenda += `Título: ${usuario.titulo}\n`;
    if (usuario.idade) legenda += `Idade: ${usuario.idade} anos\n`;
    if (usuario.cidade) legenda += `Cidade: ${usuario.cidade}\n`;
    if (usuario.statusPersonalizado) legenda += `Status: ${usuario.statusPersonalizado}\n`;
    if (relacionamento) legenda += `${relacionamento}\n`;
    if (usuario.bio) legenda += `"${usuario.bio}"\n`;
    if (resumoRpg) legenda += `${resumoRpg}\n`;
    if (resumoPet) legenda += `${resumoPet}\n`;
    legenda += `Nível: *${usuario.nivel}*\n${barra}\nXP: ${usuario.xp}/${necessario}\n`;
    legenda += `Moedas: ${usuario.moedas} 🪙\n`;
    legenda += `Mensagens: ${usuario.mensagens} | Avisos: ${usuario.avisos || 0}/3`;
    legenda += fotoPerfil ? `\n🖼️ Foto personalizada ativa` : ``;
    legenda += `\n\n💡 Use !definirfoto, !definirbio, !definiridade, !definircidade, !definirstatus para personalizar`;

    try {
      const imagem = await gerarImagemPerfil({
        nome: usuario.nome,
        titulo: usuario.titulo,
        nivel: usuario.nivel,
        xp: usuario.xp,
        xpMax: necessario,
        moedas: usuario.moedas,
        bio: usuario.bio,
        relacionamento,
        corMoldura: usuario.corPerfil || 0x0f172aff,
        fotoPerfil,
        pet: usuario.pet,
        rpg: usuario.rpg,
        idade: usuario.idade,
        cidade: usuario.cidade,
        status: usuario.statusPersonalizado,
        mensagens: usuario.mensagens,
      });
      await sock.sendMessage(from, {
        image: imagem,
        caption: legenda,
        mentions: alvoJid !== senderJid ? [alvoJid] : [],
      });
    } catch (erro) {
      console.error("Erro na imagem do perfil:", erro);
      await sock.sendMessage(from, { text: legenda, mentions: alvoJid !== senderJid ? [alvoJid] : [] });
    }
  },

  async definirbio({ sock, from, args, senderJid, nomeUsuario }) {
    const texto = args.join(" ");
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!texto) {
      usuario.bio = "";
      salvar();
      return sock.sendMessage(from, { text: "Bio removida. Use !definirbio <texto> pra colocar uma nova." });
    }
    if (texto.length > 80) return sock.sendMessage(from, { text: "Máximo de 80 caracteres pra bio." });
    usuario.bio = texto;
    salvar();
    await sock.sendMessage(from, { text: "✅ Bio atualizada! Veja no !perfil." });
  },

  async definiridade({ sock, from, args, senderJid, nomeUsuario }) {
    const idade = parseInt(args[0], 10);
    if (!idade || idade < 1 || idade > 120) return sock.sendMessage(from, { text: "Use: !definiridade <número>" });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    usuario.idade = idade;
    salvar();
    await sock.sendMessage(from, { text: `✅ Idade definida: ${idade} anos! Veja no !perfil.` });
  },

  async definircidade({ sock, from, args, senderJid, nomeUsuario }) {
    const cidade = args.join(" ");
    if (!cidade) return sock.sendMessage(from, { text: "Use: !definircidade <nome da cidade>" });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    usuario.cidade = cidade.slice(0, 50);
    salvar();
    await sock.sendMessage(from, { text: `✅ Cidade definida: ${cidade}! Veja no !perfil.` });
  },

  async defincidade(ctx) {
    return perfil.definircidade(ctx);
  },

  async definirstatus({ sock, from, args, senderJid, nomeUsuario }) {
    const status = args.join(" ");
    if (!status) return sock.sendMessage(from, { text: "Use: !definirstatus <seu status>" });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    usuario.statusPersonalizado = status.slice(0, 50);
    salvar();
    await sock.sendMessage(from, { text: `✅ Status definido! Veja no !perfil.` });
  },

  async defirstatus(ctx) {
    return perfil.definirstatus(ctx);
  },

  async definirfoto({ sock, from, msg, senderJid, nomeUsuario }) {
    const msgAlvo = resolverMsgAlvo(msg, from);
    if (!msgAlvo.message?.imageMessage) {
      return sock.sendMessage(from, { text: "Responda a uma imagem com !definirfoto para definir sua foto de perfil personalizada." });
    }
    try {
      const buffer = await downloadMediaMessage(msgAlvo, "buffer", {});
      salvarFotoPerfil(senderJid, buffer);
      await sock.sendMessage(from, { text: "✅ Foto de perfil personalizada definida! Veja no !perfil." });
    } catch (erro) {
      console.error("Erro ao salvar foto:", erro);
      await sock.sendMessage(from, { text: "❌ Não consegui salvar a foto." });
    }
  },

  async removerfoto({ sock, from, senderJid }) {
    const removido = removerFotoPerfil(senderJid);
    if (removido) {
      await sock.sendMessage(from, { text: "✅ Foto de perfil personalizada removida." });
    } else {
      await sock.sendMessage(from, { text: "Você não tinha foto personalizada definida." });
    }
  },

  async molduras({ sock, from }) {
    const texto = "🎨 *MOLDURAS DO PERFIL*\n\n" +
      MOLDURAS.map((m) => `${m.id} — ${m.nome} — ${m.preco} 🪙`).join("\n") +
      "\n\nCompre com: !comprarmoldura <id>";
    await sock.sendMessage(from, { text: texto });
  },

  async comprarmoldura({ sock, from, args, senderJid, nomeUsuario }) {
    const id = (args[0] || "").toLowerCase();
    const moldura = MOLDURAS.find((m) => m.id === id);
    if (!moldura) return sock.sendMessage(from, { text: "Moldura não encontrada. Veja !molduras pra lista de ids." });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.moedas < moldura.preco) {
      return sock.sendMessage(from, { text: `Moedas insuficientes. Você tem ${usuario.moedas} 🪙, precisa de ${moldura.preco} 🪙.` });
    }
    usuario.moedas -= moldura.preco;
    usuario.corPerfil = moldura.cor;
    salvar();
    await sock.sendMessage(from, { text: `✅ Moldura ${moldura.nome} aplicada! Veja no !perfil.` });
  },

  async casar({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !casar @pessoa" });
    const alvo = mencionados[0];
    if (alvo === senderJid) return sock.sendMessage(from, { text: "Você não pode casar consigo mesmo 😅" });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.casadoCom) return sock.sendMessage(from, { text: "Você já é casado(a)! Use !divorciar primeiro." });
    const usuarioAlvo = pegarUsuario(alvo, undefined);
    if (usuarioAlvo.casadoCom) return sock.sendMessage(from, { text: "Essa pessoa já é casada com alguém 💔" });
    pedidosCasamento[alvo] = { de: senderJid, chat: from };
    await sock.sendMessage(from, {
      text: `💍 ${usuario.nome} pediu @${alvo.split("@")[0]} em casamento!\nDigite !aceitar ou !recusar`,
      mentions: [alvo],
    });
  },

  async aceitar({ sock, from, senderJid, nomeUsuario }) {
    const pedido = pedidosCasamento[senderJid];
    if (!pedido || pedido.chat !== from) return sock.sendMessage(from, { text: "Você não tem nenhum pedido de casamento pendente aqui." });
    delete pedidosCasamento[senderJid];
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const usuarioPedinte = pegarUsuario(pedido.de, undefined);
    usuario.casadoCom = pedido.de;
    usuarioPedinte.casadoCom = senderJid;
    salvar();
    await sock.sendMessage(from, {
      text: `💒 @${senderJid.split("@")[0]} aceitou o pedido de ${usuarioPedinte.nome}! Parabéns aos noivos 🎉`,
      mentions: [senderJid, pedido.de],
    });
  },

  async recusar({ sock, from, senderJid }) {
    const pedido = pedidosCasamento[senderJid];
    if (!pedido || pedido.chat !== from) return sock.sendMessage(from, { text: "Você não tem nenhum pedido de casamento pendente aqui." });
    delete pedidosCasamento[senderJid];
    await sock.sendMessage(from, { text: "💔 O pedido de casamento foi recusado." });
  },

  async divorciar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.poliRelacao && usuario.poliRelacao.length > 0) {
      for (const jid of usuario.poliRelacao) {
        const parceiro = pegarUsuario(jid, undefined);
        parceiro.poliRelacao = (parceiro.poliRelacao || []).filter((j) => j !== senderJid);
      }
      usuario.poliRelacao = [];
      salvar();
      return sock.sendMessage(from, { text: `💔 ${usuario.nome} saiu do relacionamento múltiplo.` });
    }
    if (!usuario.casadoCom) return sock.sendMessage(from, { text: "Você não é casado(a) com ninguém." });
    const exConjuge = pegarUsuario(usuario.casadoCom, undefined);
    exConjuge.casadoCom = null;
    usuario.casadoCom = null;
    salvar();
    await sock.sendMessage(from, { text: `💔 ${usuario.nome} e ${exConjuge.nome} se divorciaram.` });
  },

  async trisal({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length !== 2) return sock.sendMessage(from, { text: "Use: !trisal @pessoa1 @pessoa2 (exatamente 2 pessoas)" });
    if (mencionados.includes(senderJid)) return sock.sendMessage(from, { text: "Você não precisa se marcar, só os outros dois 😅" });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const todos = [senderJid, ...mencionados];
    for (const jid of todos) {
      const u = pegarUsuario(jid, undefined);
      u.casadoCom = null;
      u.poliRelacao = todos.filter((j) => j !== jid);
    }
    salvar();
    await sock.sendMessage(from, {
      text: `💞 *TRISAL FORMADO!*\n${todos.map((j) => `@${j.split("@")[0]}`).join(" + ")}\n\nQue venha a felicidade a três! 🎉`,
      mentions: todos,
    });
  },

  async quadrisal({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length !== 3) return sock.sendMessage(from, { text: "Use: !quadrisal @pessoa1 @pessoa2 @pessoa3 (exatamente 3 pessoas)" });
    if (mencionados.includes(senderJid)) return sock.sendMessage(from, { text: "Você não precisa se marcar, só os outros três 😅" });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    const todos = [senderJid, ...mencionados];
    for (const jid of todos) {
      const u = pegarUsuario(jid, undefined);
      u.casadoCom = null;
      u.poliRelacao = todos.filter((j) => j !== jid);
    }
    salvar();
    await sock.sendMessage(from, {
      text: `💞 *QUADRISAL FORMADO!*\n${todos.map((j) => `@${j.split("@")[0]}`).join(" + ")}\n\nAmor múltiplo, felicidade multiplicada! 🎉`,
      mentions: todos,
    });
  },

  async casarbot({ sock, from, msg }) {
    if (db.botCasadoCom) {
      const nomeAtual = `@${db.botCasadoCom.split("@")[0]}`;
      return sock.sendMessage(from, { text: `💍 Já sou casado(a) com ${nomeAtual}! Use !divorciarbot pra terminar antes.`, mentions: [db.botCasadoCom] });
    }
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !casarbot @pessoa" });
    const alvo = mencionados[0];
    const nomeAlvo = `@${alvo.split("@")[0]}`;
    const aceitou = Math.random() < 0.5;
    if (aceitou) {
      db.botCasadoCom = alvo;
      salvar();
      await sock.sendMessage(from, { text: `💍 Aceito! Agora sou casado(a) com ${nomeAlvo} 🎉`, mentions: [alvo] });
    } else {
      await sock.sendMessage(from, { text: `💔 Ihh, não rolou dessa vez, ${nomeAlvo}... quem sabe outro dia 😅`, mentions: [alvo] });
    }
  },

  async divorciarbot({ sock, from }) {
    if (!db.botCasadoCom) return sock.sendMessage(from, { text: "Não sou casado(a) com ninguém no momento." });
    const nomeAntigo = `@${db.botCasadoCom.split("@")[0]}`;
    const jidAntigo = db.botCasadoCom;
    db.botCasadoCom = null;
    salvar();
    await sock.sendMessage(from, { text: `💔 Terminei com ${nomeAntigo}. Tá solteiro(a) de novo por aqui.`, mentions: [jidAntigo] });
  },

  async shipp({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);

    let pessoa1Jid, pessoa2Jid, nome1, nome2;

    if (mencionados.length >= 2) {
      // Shippar duas pessoas mencionadas
      pessoa1Jid = mencionados[0];
      pessoa2Jid = mencionados[1];
      nome1 = pegarUsuario(pessoa1Jid, undefined).nome;
      nome2 = pegarUsuario(pessoa2Jid, undefined).nome;
    } else if (mencionados.length === 1) {
      // Comportamento antigo: remetente + mencionado
      pessoa1Jid = senderJid;
      pessoa2Jid = mencionados[0];
      nome1 = pegarUsuario(senderJid, nomeUsuario).nome;
      nome2 = pegarUsuario(pessoa2Jid, undefined).nome;
    } else {
      return sock.sendMessage(from, { text: "Use: !shipp @pessoa1 @pessoa2 (duas pessoas) ou !shipp @pessoa (você + pessoa)" });
    }

    const porcentagem = (pessoa1Jid.startsWith(NUMERO_SHIPP_100) || pessoa2Jid.startsWith(NUMERO_SHIPP_100))
      ? 100 : Math.floor(Math.random() * 101);

    try {
      const [urlFoto1, urlFoto2] = await Promise.all([
        sock.profilePictureUrl(pessoa1Jid, "image").catch(() => null),
        sock.profilePictureUrl(pessoa2Jid, "image").catch(() => null),
      ]);
      const imagem = await gerarImagemShipp({ urlFoto1, urlFoto2, nome1, nome2, porcentagem });
      const mentions = [pessoa1Jid, pessoa2Jid].filter((j) => j !== senderJid);
      await sock.sendMessage(from, {
        image: imagem,
        caption: `💘 *Shipp*\n${nome1} + ${nome2}\nCompatibilidade: ${porcentagem}%`,
        mentions,
      });
    } catch (erro) {
      console.error("Erro ao gerar imagem do shipp:", erro);
      const preenchido = Math.round(porcentagem / 10);
      const barra = "💗".repeat(preenchido) + "🤍".repeat(10 - preenchido);
      const mentions = [pessoa1Jid, pessoa2Jid].filter((j) => j !== senderJid);
      await sock.sendMessage(from, {
        text: `💘 *Shipp*\n${nome1} + ${nome2}\n${barra}\nCompatibilidade: ${porcentagem}%`,
        mentions,
      });
    }
  },

  async rankxp({ sock, from }) {
    const lista = Object.values(db.usuarios)
      .sort((a, b) => b.nivel - a.nivel || b.xp - a.xp)
      .slice(0, 10);
    if (lista.length === 0) return sock.sendMessage(from, { text: "Ninguém no ranking ainda." });
    const texto = "🏆 *RANK POR XP*\n\n" + lista.map((u, i) => `${i + 1}. ${u.nome} — nível ${u.nivel} (${u.xp} xp)`).join("\n");
    await sock.sendMessage(from, { text: texto });
  },

  async ranking({ sock, from }) {
    const lista = Object.values(db.usuarios)
      .sort((a, b) => b.mensagens - a.mensagens)
      .slice(0, 10);
    if (lista.length === 0) return sock.sendMessage(from, { text: "Ninguém no ranking ainda." });
    const texto = "💬 *RANK POR MENSAGENS*\n\n" + lista.map((u, i) => `${i + 1}. ${u.nome} — ${u.mensagens} mensagens`).join("\n");
    await sock.sendMessage(from, { text: texto });
  },

  async loja({ sock, from }) {
    const texto = "🛒 *LOJA*\n\n" + LOJA.map((item) => `${item.id} — ${item.nome} — ${item.preco} 🪙`).join("\n") +
      "\n\nCompre com: !comprar <id>";
    await sock.sendMessage(from, { text: texto });
  },

  async comprar({ sock, from, args, senderJid, nomeUsuario }) {
    const id = (args[0] || "").toLowerCase();
    const item = LOJA.find((i) => i.id === id);
    if (!item) return sock.sendMessage(from, { text: "Item não encontrado. Veja !loja para a lista de ids." });
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.moedas < item.preco) {
      return sock.sendMessage(from, { text: `Moedas insuficientes. Você tem ${usuario.moedas} 🪙, precisa de ${item.preco} 🪙.` });
    }
    usuario.moedas -= item.preco;
    usuario.titulo = item.nome;
    salvar();
    await sock.sendMessage(from, { text: `✅ Você comprou o título ${item.nome}!` });
  },

  async apostar({ sock, from, args, senderJid, nomeUsuario }) {
    const valor = Number(args[0]);
    if (!Number.isSafeInteger(valor) || valor < 1 || valor > 1000) {
      return sock.sendMessage(from, { text: "Use uma aposta inteira entre 1 e 1000 moedas: !apostar <valor>" });
    }
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.moedas < valor) {
      return sock.sendMessage(from, { text: `Você só tem ${usuario.moedas} 🪙.` });
    }
    const ganhou = Math.random() < 0.45;
    if (ganhou) {
      usuario.moedas += valor;
      salvar();
      await sock.sendMessage(from, { text: `🎉 Você apostou ${valor} e dobrou! Agora tem ${usuario.moedas} 🪙` });
    } else {
      usuario.moedas -= valor;
      salvar();
      await sock.sendMessage(from, { text: `💸 Você perdeu ${valor} 🪙. Agora tem ${usuario.moedas} 🪙` });
    }
  },

  async afk({ sock, from, args, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    usuario.afk = true;
    usuario.afkMotivo = args.join(" ") || "sem motivo especificado";
    usuario.afkDesde = Date.now();
    salvar();
    await sock.sendMessage(from, { text: `💤 ${usuario.nome} está AFK: ${usuario.afkMotivo}` });
  },
};

// ===================== BRINCADEIRAS E JOGOS =====================

const brincadeiras = {
  async piada({ sock, from }) { await sock.sendMessage(from, { text: "😂 " + escolher(PIADAS) }); },
  async meme({ sock, from }) { await sock.sendMessage(from, { text: escolher(MEMES_TEXTO) }); },
  async sorte({ sock, from }) { await sock.sendMessage(from, { text: "🔮 " + escolher(SORTES) }); },
  async dado({ sock, from }) { await sock.sendMessage(from, { text: `🎲 Você tirou: ${Math.floor(Math.random() * 6) + 1}` }); },
  async moeda({ sock, from }) { await sock.sendMessage(from, { text: `🪙 ${Math.random() < 0.5 ? "Cara" : "Coroa"}!` }); },

  async ppt({ sock, from, args }) {
    const opcoes = ["pedra", "papel", "tesoura"];
    const escolhaUsuario = (args[0] || "").toLowerCase();
    if (!opcoes.includes(escolhaUsuario)) {
      return sock.sendMessage(from, { text: "Use: !ppt pedra | papel | tesoura" });
    }
    const escolhaBot = escolher(opcoes);
    let resultado;
    if (escolhaBot === escolhaUsuario) resultado = "Empate! 🤝";
    else if (
      (escolhaUsuario === "pedra" && escolhaBot === "tesoura") ||
      (escolhaUsuario === "papel" && escolhaBot === "pedra") ||
      (escolhaUsuario === "tesoura" && escolhaBot === "papel")
    ) resultado = "Você ganhou! 🎉";
    else resultado = "Você perdeu! 😢";
    await sock.sendMessage(from, { text: `Você: ${escolhaUsuario}\nBot: ${escolhaBot}\n${resultado}` });
  },

  async desafio({ sock, from }) { await sock.sendMessage(from, { text: "🎯 Desafio: " + escolher(DESAFIOS) }); },

  async futebol({ sock, from, args }) {
    await animarCarregamento(sock, from, "⚽ Preparando a partida", 2, 300);

    // Permite escolher times: !futebol Time A | Time B
    let timeA, timeB;
    const partes = args.join(" ").split("|").map((p) => p.trim()).filter(Boolean);
    if (partes.length >= 2) {
      timeA = partes[0];
      timeB = partes[1];
    } else if (partes.length === 1) {
      timeA = partes[0];
      timeB = escolher(TIMES_ESPORTE);
      while (timeB === timeA) timeB = escolher(TIMES_ESPORTE);
    } else {
      timeA = escolher(TIMES_ESPORTE);
      timeB = escolher(TIMES_ESPORTE);
      while (timeB === timeA) timeB = escolher(TIMES_ESPORTE);
    }

    const golsA = Math.floor(Math.random() * 5);
    const golsB = Math.floor(Math.random() * 5);
    const minutosA = Array.from({ length: golsA }, () => Math.floor(Math.random() * 90) + 1);
    const minutosB = Array.from({ length: golsB }, () => Math.floor(Math.random() * 90) + 1);

    let eventos = [
      ...minutosA.map((m) => ({ m, time: timeA, tipo: "gol", jogador: escolher(NOMES_JOGADORES) })),
      ...minutosB.map((m) => ({ m, time: timeB, tipo: "gol", jogador: escolher(NOMES_JOGADORES) })),
    ];

    if (Math.random() < 0.5) eventos.push({ m: Math.floor(Math.random() * 90) + 1, time: escolher([timeA, timeB]), tipo: "amarelo", jogador: escolher(NOMES_JOGADORES) });
    if (Math.random() < 0.15) eventos.push({ m: Math.floor(Math.random() * 90) + 1, time: escolher([timeA, timeB]), tipo: "vermelho", jogador: escolher(NOMES_JOGADORES) });

    eventos.sort((a, b) => a.m - b.m);

    const posseA = Math.floor(Math.random() * 40) + 30;
    const posseB = 100 - posseA;
    const iconeEvento = { gol: "⚽ Gol", amarelo: "🟨 Cartão amarelo", vermelho: "🟥 Cartão vermelho" };
    let narrativa = `⚽ *${timeA}* 🆚 *${timeB}*\n\n`;
    narrativa += eventos.length === 0
      ? "🔒 Jogo truncado, sem eventos de destaque!\n"
      : eventos.map((e) => `${iconeEvento[e.tipo]} — ${e.jogador} (${e.time}) aos ${e.m}'`).join("\n") + "\n";
    narrativa += `\n📊 Posse de bola: ${timeA} ${posseA}% — ${posseB}% ${timeB}\n`;
    narrativa += `\n🏁 *Placar normal: ${timeA} ${golsA} x ${golsB} ${timeB}*\n`;

    let golsFinaisA = golsA, golsFinaisB = golsB, vencedor;

    if (golsA === golsB) {
      narrativa += "🤝 Empate no tempo normal!\n";
      if (Math.random() < 0.4) {
        narrativa += "⏱️ Vai pra prorrogação...\n\n";
        if (Math.random() < 0.5) {
          const timeGol = escolher([timeA, timeB]);
          const jogadorGol = escolher(NOMES_JOGADORES);
          const minutoExtra = 90 + Math.floor(Math.random() * 30) + 1;
          narrativa += `⚽ GOL NA PRORROGAÇÃO! ${jogadorGol} (${timeGol}) aos ${minutoExtra}'!\n\n`;
          vencedor = timeGol;
          golsFinaisA = timeGol === timeA ? golsA + 1 : golsA;
          golsFinaisB = timeGol === timeB ? golsB + 1 : golsB;
          narrativa += `🏁 *Placar após prorrogação: ${timeA} ${golsFinaisA} x ${golsFinaisB} ${timeB}*\n`;
        } else {
          narrativa += "😮‍💨 Nada na prorrogação também. Vai pra disputa de pênaltis...\n\n";
          const penaltis = disputaPenaltis(timeA, timeB);
          narrativa += `🥅 *PÊNALTIS*\n${penaltis.resumo}\n\nPênaltis: ${penaltis.colocA} x ${penaltis.colocB}\n`;
          vencedor = penaltis.vencedor;
          golsFinaisA = penaltis.colocA;
          golsFinaisB = penaltis.colocB;
        }
      } else {
        narrativa += "Sem prorrogação, direto pra disputa de pênaltis...\n\n";
        const penaltis = disputaPenaltis(timeA, timeB);
        narrativa += `🥅 *PÊNALTIS*\n${penaltis.resumo}\n\nPênaltis: ${penaltis.colocA} x ${penaltis.colocB}\n`;
        vencedor = penaltis.vencedor;
        golsFinaisA = penaltis.colocA;
        golsFinaisB = penaltis.colocB;
      }
    } else {
      vencedor = golsA > golsB ? timeA : timeB;
    }

    const golsTimeVencedor = eventos.filter((e) => e.tipo === "gol" && e.time === vencedor);
    if (golsTimeVencedor.length > 0) {
      narrativa += `⭐ Melhor em campo: ${escolher(golsTimeVencedor).jogador}\n`;
    }
    narrativa += `🏆 Vencedor: *${vencedor}*`;

    try {
      const imagem = await gerarImagemPlacar({ tituloTopo: "⚽ FUTEBOL", timeA, timeB, golsA: golsFinaisA, golsB: golsFinaisB });
      await sock.sendMessage(from, { image: imagem, caption: narrativa });
    } catch (erro) {
      console.error("Erro ao gerar imagem do futebol:", erro);
      await sock.sendMessage(from, { text: narrativa });
    }
  },

  async penalti({ sock, from, args }) {
    const lado = (args[0] || "").toLowerCase();
    const lados = ["esquerda", "meio", "direita"];
    if (!lados.includes(lado)) {
      return sock.sendMessage(from, { text: "Escolha um lado: !penalti esquerda | meio | direita" });
    }
    const defesaGoleiro = escolher(lados);
    const golDoUsuario = lado !== defesaGoleiro;
    const chuteAdversario = Math.random() < 0.75;
    let resultado = golDoUsuario ? "⚽ GOL SEU!" : "🧤 O goleiro defendeu!";
    resultado += "\n" + (chuteAdversario ? "⚽ O adversário também marcou." : "❌ O adversário perdeu o pênalti dele!");
    await sock.sendMessage(from, { text: `🥅 *PÊNALTI*\nVocê chutou: ${lado}\nGoleiro pulou: ${defesaGoleiro}\n\n${resultado}` });
  },

  async basquete({ sock, from, args }) {
    await animarCarregamento(sock, from, "🏀 Preparando o jogo", 2, 300);

    let timeA, timeB;
    const partes = args.join(" ").split("|").map((p) => p.trim()).filter(Boolean);
    if (partes.length >= 2) {
      timeA = partes[0];
      timeB = partes[1];
    } else {
      timeA = escolher(TIMES_ESPORTE);
      timeB = escolher(TIMES_ESPORTE);
      while (timeB === timeA) timeB = escolher(TIMES_ESPORTE);
    }

    function gerarQuarto() { return Math.floor(Math.random() * 14) + 16; }
    const quartosA = [gerarQuarto(), gerarQuarto(), gerarQuarto(), gerarQuarto()];
    const quartosB = [gerarQuarto(), gerarQuarto(), gerarQuarto(), gerarQuarto()];
    const pontosA = quartosA.reduce((s, q) => s + q, 0);
    const pontosB = quartosB.reduce((s, q) => s + q, 0);
    const cestinhaA = Math.floor(Math.random() * 30) + 15;
    const cestinhaB = Math.floor(Math.random() * 30) + 15;
    const tresPontosA = Math.floor(Math.random() * 12) + 2;
    const tresPontosB = Math.floor(Math.random() * 12) + 2;

    const vencedor = pontosA === pontosB ? null : (pontosA > pontosB ? timeA : timeB);
    let narrativa = `🏀 *${timeA}* 🆚 *${timeB}*\n\n`;
    narrativa += "📋 *Por quarto:*\n";
    for (let i = 0; i < 4; i++) { narrativa += `Q${i + 1}: ${quartosA[i]} — ${quartosB[i]}\n`; }
    narrativa += `\n🎯 Cestinha ${timeA}: ${cestinhaA} pts (${tresPontosA} de 3)\n`;
    narrativa += `🎯 Cestinha ${timeB}: ${cestinhaB} pts (${tresPontosB} de 3)\n\n`;
    narrativa += `🏁 *Placar final: ${timeA} ${pontosA} x ${pontosB} ${timeB}*\n`;
    narrativa += vencedor ? `🏆 Vencedor: *${vencedor}*` : "🤝 Empate incrível (raro no basquete)!";

    try {
      const imagem = await gerarImagemPlacar({ tituloTopo: "🏀 BASQUETE", timeA, timeB, golsA: pontosA, golsB: pontosB, corFundo: 0x7c2d12ff });
      await sock.sendMessage(from, { image: imagem, caption: narrativa });
    } catch (erro) {
      console.error("Erro ao gerar imagem do basquete:", erro);
      await sock.sendMessage(from, { text: narrativa });
    }
  },

  async copa({ sock, from, args }) {
    await animarCarregamento(sock, from, "🏆 Sorteando o chaveamento", 3, 350);

    // Permite escolher times: !copa time1 | time2 | time3 | ...
    let participantes;
    const partes = args.join(" ").split("|").map((p) => p.trim()).filter(Boolean);

    if (partes.length >= 4) {
      // Usa os times escolhidos, completa com sorteados se necessário
      participantes = [...partes];
      while (participantes.length < 8) {
        const novo = escolher(TIMES_ESPORTE);
        if (!participantes.includes(novo)) participantes.push(novo);
      }
      participantes = participantes.slice(0, 8);
    } else {
      participantes = [...TIMES_ESPORTE].sort(() => Math.random() - 0.5).slice(0, 8);
    }

    function jogarPartida(a, b) {
      let golsA = Math.floor(Math.random() * 4);
      let golsB = Math.floor(Math.random() * 4);
      if (golsA === golsB) { if (Math.random() < 0.5) golsA++; else golsB++; }
      return { vencedor: golsA > golsB ? a : b, golsA, golsB, penaltis: false };
    }

    let narrativa = "🏆 *COPA RELÂMPAGO*\n\n";
    narrativa += `Participantes:\n${participantes.map((t) => `• ${t}`).join("\n")}\n\n`;

    narrativa += "*Quartas de final:*\n";
    const semifinalistas = [];
    for (let i = 0; i < 8; i += 2) {
      const partida = jogarPartida(participantes[i], participantes[i + 1]);
      narrativa += `${participantes[i]} 🆚 ${participantes[i + 1]} → *${partida.vencedor}* (${partida.golsA} x ${partida.golsB})\n`;
      semifinalistas.push(partida.vencedor);
    }

    narrativa += "\n*Semifinal:*\n";
    const finalistas = [];
    for (let i = 0; i < 4; i += 2) {
      const partida = jogarPartida(semifinalistas[i], semifinalistas[i + 1]);
      narrativa += `${semifinalistas[i]} 🆚 ${semifinalistas[i + 1]} → *${partida.vencedor}* (${partida.golsA} x ${partida.golsB})\n`;
      finalistas.push(partida.vencedor);
    }

    narrativa += "\n*Final:*\n";
    const partidaFinal = jogarPartida(finalistas[0], finalistas[1]);
    narrativa += `${finalistas[0]} 🆚 ${finalistas[1]} → *${partidaFinal.vencedor}* (${partidaFinal.golsA} x ${partidaFinal.golsB})\n\n`;
    narrativa += `🏆🎉 *CAMPEÃO: ${partidaFinal.vencedor}* 🎉🏆`;

    await sock.sendMessage(from, { text: narrativa });
  },

  async corrida({ sock, from }) {
    const participantes = ["🐢", "🐇", "🐎", "🐕", "🐆"];
    await animarCarregamento(sock, from, "🏁 Corrida começando", 2, 300);
    const vencedor = escolher(participantes);
    const ordem = [...participantes].sort(() => Math.random() - 0.5);
    await sock.sendMessage(from, {
      text: `🏁 *CORRIDA*\nOrdem de chegada: ${ordem.join(" → ")}\n\n🥇 Vencedor: ${vencedor}`,
    });
  },

  async quiz({ sock, from, senderJid }) {
    const perguntas = [
      { p: "Quantos continentes existem?", r: "7" },
      { p: "Qual é a capital do Brasil?", r: "Brasília" },
      { p: "Quantos lados tem um hexágono?", r: "6" },
      { p: "Qual é o maior planeta do sistema solar?", r: "Júpiter" },
    ];
    const escolhida = escolher(perguntas);
    desafiosMatematica[chaveDoJogo(from, senderJid)] = { resposta: normalizarRespostaJogo(escolhida.r), tipo: "quiz" };
    await sock.sendMessage(from, { text: `❓ Quiz: ${escolhida.p}\nResponda com !resposta <sua resposta>` });
  },

  async enigma({ sock, from, senderJid }) {
    const enigmas = [
      { p: "Tenho cidades, mas não tenho casas; tenho florestas, mas não tenho árvores; tenho rios, mas não tenho água. O que sou?", r: "mapa" },
      { p: "Quanto mais você tira, maior eu fico. O que sou?", r: "buraco" },
      { p: "Não tenho vida, mas posso morrer. O que sou?", r: "bateria" },
      { p: "Tenho dentes, mas não mordo. O que sou?", r: "pente" },
      { p: "Quanto mais seco, mais pesado fico. O que sou?", r: "toalha" },
      { p: "Voo sem asas, choro sem olhos. O que sou?", r: "nuvem" },
    ];
    const escolhido = escolher(enigmas);
    desafiosMatematica[chaveDoJogo(from, senderJid)] = { resposta: normalizarRespostaJogo(escolhido.r), tipo: "enigma" };
    await sock.sendMessage(from, { text: `🧩 Enigma: ${escolhido.p}\nResponda com !resposta <sua resposta>` });
  },

  async anagrama({ sock, from, senderJid }) {
    const palavras = ["computador", "elefante", "biblioteca", "montanha", "borboleta", "guitarra", "floresta", "chocolate"];
    const palavra = escolher(palavras);
    let embaralhada = palavra;
    while (embaralhada === palavra) { embaralhada = palavra.split("").sort(() => Math.random() - 0.5).join(""); }
    desafiosMatematica[chaveDoJogo(from, senderJid)] = { resposta: normalizarRespostaJogo(palavra), tipo: "anagrama" };
    await sock.sendMessage(from, { text: `🔤 Anagrama: *${embaralhada.toUpperCase()}*\nResponda com !resposta <palavra>` });
  },

  async roleta({ sock, from, senderJid, nomeUsuario }) {
    await animarCarregamento(sock, from, "🎰 Girando a roleta", 3, 250);
    const premios = [0, 5, 10, 20, 50, -10];
    const premio = escolher(premios);
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    usuario.moedas = Math.max(0, usuario.moedas + premio);
    salvar();
    const texto = premio >= 0
      ? `🎰 A roleta parou... você ganhou ${premio} moedas! 🪙`
      : `🎰 A roleta parou... você perdeu ${Math.abs(premio)} moedas! 😬`;
    await sock.sendMessage(from, { text: texto });
  },

  async previsao({ sock, from }) { await sock.sendMessage(from, { text: "🔮 Previsão do dia: " + escolher(PREVISOES) }); },
  async fatoaleatorio({ sock, from }) { await sock.sendMessage(from, { text: "🧠 Você sabia?\n" + escolher(FATOS_ALEATORIOS) }); },

  async top({ sock, from }) {
    const lista = Object.values(db.usuarios)
      .sort((a, b) => b.moedas - a.moedas)
      .slice(0, 10);
    if (lista.length === 0) return sock.sendMessage(from, { text: "Ninguém no ranking ainda." });
    const texto = "💰 *TOP MOEDAS*\n\n" + lista.map((u, i) => `${i + 1}. ${u.nome} — ${u.moedas} 🪙`).join("\n");
    await sock.sendMessage(from, { text: texto });
  },

  async emoji({ sock, from }) {
    const emojis = ["😀", "😎", "🥳", "😴", "🤔", "😭", "🤯", "🥶", "🤠", "👻", "🤡", "🫠", "😏", "🫡", "🥴", "🤩", "😈", "🧐"];
    const sorteados = Array.from({ length: 3 }, () => escolher(emojis));
    await sock.sendMessage(from, { text: `🎭 Seu humor de hoje é: ${sorteados.join(" ")}` });
  },

  async animerandom({ sock, from }) { await sock.sendMessage(from, { text: "🐉 " + escolher(ANIMES) }); },
  async frase({ sock, from }) { await sock.sendMessage(from, { text: "💬 " + escolher(FRASES_ESTILO_ANIME) }); },
  async personagem({ sock, from }) { await sock.sendMessage(from, { text: "🎭 " + escolher(PERSONAGENS) }); },

  async oraculo({ sock, from, args }) {
    const pergunta = args.join(" ");
    if (!pergunta) return sock.sendMessage(from, { text: "Use: !oraculo <sua pergunta de sim/não>" });
    await sock.sendMessage(from, { text: `🔮 *Oráculo*\n"${pergunta}"\n\n${escolher(RESPOSTAS_ORACULO)}` });
  },

  async conselho({ sock, from }) { await sock.sendMessage(from, { text: "💡 " + escolher(CONSELHOS) }); },
  async citacao({ sock, from }) { await sock.sendMessage(from, { text: "📜 " + escolher(CITACOES) }); },

  async verdadeoudesafio({ sock, from, args }) {
    const escolha = (args[0] || "").toLowerCase();
    if (escolha === "verdade") return sock.sendMessage(from, { text: "❓ *Verdade:*\n" + escolher(VERDADES) });
    if (escolha === "desafio") return sock.sendMessage(from, { text: "🎯 *Desafio:*\n" + escolher(DESAFIOS_VD) });
    await sock.sendMessage(from, { text: "Use: !verdadeoudesafio verdade  OU  !verdadeoudesafio desafio" });
  },

  async rimas({ sock, from, args }) {
    const tema = args.join(" ") || "vida";
    const linhas = [
      `No caminho da ${tema}, sigo firme sem parar,`,
      `cada obstáculo que vem, eu aprendo a superar.`,
      `Se o dia tá difícil, eu não vou desanimar,`,
      `porque o esforço de hoje é semente pra colher amanhã.`,
    ];
    await sock.sendMessage(from, { text: `🎤 *Rima livre — tema: ${tema}*\n\n${linhas.join("\n")}` });
  },

  async gerarnome({ sock, from }) {
    const nome = escolher(NOMES_FANTASIA.prefixos) + escolher(NOMES_FANTASIA.sufixos);
    await sock.sendMessage(from, { text: `🧙 Seu nome de fantasia é: *${nome}*` });
  },

  async horoscopo({ sock, from, args }) {
    const signo = (args.join(" ") || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize();
    const chaveEncontrada = Object.keys(SIGNOS).find((s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === signo);
    if (!chaveEncontrada) {
      return sock.sendMessage(from, { text: `Use: !horoscopo <signo>\nSignos: ${Object.keys(SIGNOS).join(", ")}` });
    }
    await sock.sendMessage(from, { text: `♈ *${chaveEncontrada}*\n${SIGNOS[chaveEncontrada]}` });
  },

  async caraoucoroa({ sock, from }) { await sock.sendMessage(from, { text: `🪙 ${Math.random() < 0.5 ? "Cara" : "Coroa"}!` }); },

  async kill({ sock, from, msg }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Marca alguém: !kill @pessoa" });
    await sock.sendMessage(from, {
      text: `💀 @${mencionados[0].split("@")[0]} foi eliminado(a) dramaticamente! (é só brincadeira 😄)`,
      mentions: mencionados,
    });
  },

  async reviver({ sock, from, msg }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Marca alguém: !reviver @pessoa" });
    await sock.sendMessage(from, {
      text: `✨ @${mencionados[0].split("@")[0]} voltou à vida!`,
      mentions: mencionados,
    });
  },

  async matematica({ sock, from, senderJid }) {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    const operadores = ["+", "-", "*"];
    const op = escolher(operadores);
    let resultado;
    if (op === "+") resultado = a + b;
    else if (op === "-") resultado = a - b;
    else resultado = a * b;
    desafiosMatematica[chaveDoJogo(from, senderJid)] = { resposta: String(resultado), tipo: "matematica" };
    await sock.sendMessage(from, { text: `🧮 Quanto é ${a} ${op} ${b}?\nResponda com !resposta <número>` });
  },

  async resposta({ sock, from, args, senderJid, nomeUsuario }) {
    const chave = chaveDoJogo(from, senderJid);
    const pendente = desafiosMatematica[chave];
    if (!pendente) return sock.sendMessage(from, { text: "Você não tem desafio pendente. Comece com !quiz, !enigma ou !matematica." });
    const respostaUsuario = normalizarRespostaJogo(args.join(" "));
    if (respostaUsuario === normalizarRespostaJogo(pendente.resposta)) {
      const usuario = pegarUsuario(senderJid, nomeUsuario);
      usuario.moedas += 15;
      salvar();
      delete desafiosMatematica[chave];
      await sock.sendMessage(from, { text: "✅ Resposta correta! Você ganhou 15 moedas 🪙" });
    } else {
      await sock.sendMessage(from, { text: "❌ Resposta errada, tente de novo!" });
    }
  },

  async termo({ sock, from, args, senderJid, nomeUsuario }) {
    const chave = chaveDoJogo(from, senderJid);
    const chute = (args[0] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!chute) {
      if (!jogosTermo[chave]) jogosTermo[chave] = { palavra: escolher(PALAVRAS_TERMO), tentativas: 0, historico: [] };
      return sock.sendMessage(from, {
        text: `╭─────────────╮\n   🟩 *TERMO*\n╰─────────────╯\nAdivinhe a palavra de 5 letras!\nUse: !termo <palavra>\nTentativas: ${jogosTermo[chave].tentativas}/6`,
      });
    }
    const jogo = jogosTermo[chave];
    if (!jogo) return sock.sendMessage(from, { text: "Nenhum jogo ativo. Digite !termo pra começar." });
    if (chute.length !== 5) return sock.sendMessage(from, { text: "A palavra precisa ter exatamente 5 letras." });

    jogo.tentativas++;
    const linhaResultado = avaliarPalpiteTermo(chute, jogo.palavra);
    jogo.historico.push(linhaResultado);
    const historicoAtual = jogo.historico;

    let legenda;
    if (chute === jogo.palavra) {
      const usuario = pegarUsuario(senderJid, nomeUsuario);
      const premio = Math.max(10, 40 - jogo.tentativas * 5);
      usuario.moedas += premio;
      salvar();
      legenda = `🎉 Acertou "${jogo.palavra.toUpperCase()}" em ${jogo.tentativas} tentativa(s)! +${premio} 🪙`;
      delete jogosTermo[chave];
    } else if (jogo.tentativas >= 6) {
      legenda = `😢 Acabaram as tentativas! Era "${jogo.palavra.toUpperCase()}".`;
      delete jogosTermo[chave];
    } else {
      legenda = `Tentativa ${jogo.tentativas}/6\n${resumoLetrasTermo(historicoAtual)}`;
    }

    try {
      const imagem = await gerarImagemTermo(historicoAtual);
      await sock.sendMessage(from, { image: imagem, caption: legenda });
    } catch (erro) {
      console.error("Erro ao gerar imagem do TERMO:", erro);
      const tabuleiroTexto = historicoAtual.map((linha) => linhaTermoParaEmoji(linha)).join("\n");
      await sock.sendMessage(from, { text: `${tabuleiroTexto}\n\n${legenda}` });
    }
  },

  async beleza({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    const alvo = mencionados[0];
    const nomeExibido = alvo ? `@${alvo.split("@")[0]}` : pegarUsuario(senderJid, nomeUsuario).nome;
    await sock.sendMessage(from, { text: gerarMedidor(nomeExibido, "beleza", "💅"), mentions: alvo ? [alvo] : [] });
  },

  async inteligencia({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    const alvo = mencionados[0];
    const nomeExibido = alvo ? `@${alvo.split("@")[0]}` : pegarUsuario(senderJid, nomeUsuario).nome;
    await sock.sendMessage(from, { text: gerarMedidor(nomeExibido, "inteligência", "🧠"), mentions: alvo ? [alvo] : [] });
  },

  async sortemetro({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    const alvo = mencionados[0];
    const nomeExibido = alvo ? `@${alvo.split("@")[0]}` : pegarUsuario(senderJid, nomeUsuario).nome;
    await sock.sendMessage(from, { text: gerarMedidor(nomeExibido, "sorte", "🍀"), mentions: alvo ? [alvo] : [] });
  },

  async forca({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    const alvo = mencionados[0];
    const nomeExibido = alvo ? `@${alvo.split("@")[0]}` : pegarUsuario(senderJid, nomeUsuario).nome;
    await sock.sendMessage(from, { text: gerarMedidor(nomeExibido, "força", "💪"), mentions: alvo ? [alvo] : [] });
  },

  async carisma({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    const alvo = mencionados[0];
    const nomeExibido = alvo ? `@${alvo.split("@")[0]}` : pegarUsuario(senderJid, nomeUsuario).nome;
    await sock.sendMessage(from, { text: gerarMedidor(nomeExibido, "carisma", "😎"), mentions: alvo ? [alvo] : [] });
  },

  async enforcado({ sock, from, args, senderJid, nomeUsuario }) {
    const chave = chaveDoJogo(from, senderJid);
    const letra = (args[0] || "").toLowerCase();
    if (!jogosForca[chave]) {
      const escolha = escolher(PALAVRAS_FORCA);
      jogosForca[chave] = { palavra: escolha.palavra, categoria: escolha.categoria, letrasCertas: [], letrasErradas: [], vidas: 6 };
    }
    const jogo = jogosForca[chave];
    function tabuleiro() {
      return jogo.palavra.split("").map((l) => (jogo.letrasCertas.includes(l) ? l : "_")).join(" ");
    }
    if (!letra) {
      return sock.sendMessage(from, {
        text: `🪓 *JOGO DA FORCA*\nCategoria: ${jogo.categoria}\n\n${DESENHOS_FORCA[jogo.vidas]}\n\n${tabuleiro()}\nVidas: ${"❤️".repeat(jogo.vidas)}\nErradas: ${jogo.letrasErradas.join(", ") || "nenhuma"}\nUse: !enforcado <letra>`,
      });
    }
    if (letra.length !== 1) return sock.sendMessage(from, { text: "Digite só uma letra por vez." });
    if (jogo.letrasCertas.includes(letra) || jogo.letrasErradas.includes(letra)) {
      return sock.sendMessage(from, { text: "Você já tentou essa letra!" });
    }
    if (jogo.palavra.includes(letra)) { jogo.letrasCertas.push(letra); }
    else { jogo.letrasErradas.push(letra); jogo.vidas--; }
    const ganhou = jogo.palavra.split("").every((l) => jogo.letrasCertas.includes(l));
    if (ganhou) {
      delete jogosForca[chave];
      const usuario = pegarUsuario(senderJid, nomeUsuario);
      const premio = Math.max(10, 10 + jogo.vidas * 3);
      usuario.moedas += premio;
      salvar();
      return sock.sendMessage(from, { text: `🎉 Acertou! A palavra era "${jogo.palavra.toUpperCase()}". +${premio} 🪙` });
    }
    if (jogo.vidas <= 0) {
      const palavraCerta = jogo.palavra;
      delete jogosForca[chave];
      return sock.sendMessage(from, { text: `${DESENHOS_FORCA[0]}\n\n💀 Você perdeu! A palavra era "${palavraCerta.toUpperCase()}".` });
    }
    await sock.sendMessage(from, {
      text: `🪓 ${DESENHOS_FORCA[jogo.vidas]}\n\n${tabuleiro()}\nVidas: ${"❤️".repeat(jogo.vidas)}\nErradas: ${jogo.letrasErradas.join(", ") || "nenhuma"}`,
    });
  },

  async slots({ sock, from, args, senderJid, nomeUsuario }) {
    const aposta = args[0] ? Number(args[0]) : 10;
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!Number.isSafeInteger(aposta) || aposta < 1 || aposta > 1000) {
      return sock.sendMessage(from, { text: "Use uma aposta inteira entre 1 e 1000 moedas. Ex.: !slots 25" });
    }
    if (usuario.moedas < aposta) return sock.sendMessage(from, { text: `Você só tem ${usuario.moedas} 🪙.` });
    await animarCarregamento(sock, from, "🎰 Rodando os símbolos", 2, 250);
    const simbolos = ["🍒", "🍋", "🍇", "🔔", "⭐", "💎"];
    const resultado = [escolher(simbolos), escolher(simbolos), escolher(simbolos)];
    const linha = resultado.join(" | ");
    let ganho = 0;
    if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) ganho = aposta * 10;
    else if (resultado[0] === resultado[1] || resultado[1] === resultado[2] || resultado[0] === resultado[2]) ganho = aposta * 2;
    usuario.moedas = usuario.moedas - aposta + ganho;
    salvar();
    const texto = ganho > 0
      ? `🎰 [ ${linha} ]\n🎉 Você ganhou ${ganho} 🪙! Saldo: ${usuario.moedas} 🪙`
      : `🎰 [ ${linha} ]\n💸 Não foi dessa vez. Saldo: ${usuario.moedas} 🪙`;
    await sock.sendMessage(from, { text: texto });
  },

  async bicho({ sock, from, args, senderJid, nomeUsuario }) {
    const palpite = Number(args[0]);
    if (!palpite || palpite < 1 || palpite > 25) {
      const lista = BICHOS.map((b, i) => `${i + 1}. ${b}`).join("\n");
      return sock.sendMessage(from, { text: `🐾 *JOGO DO BICHO*\nEscolha um número (1-25):\n\n${lista}\n\nUse: !bicho <número> [aposta]\nAposta padrão: 10 moedas; prêmio: 20x a aposta.` });
    }
    const aposta = args[1] ? Number(args[1]) : 10;
    if (!Number.isSafeInteger(aposta) || aposta < 1 || aposta > 500) {
      return sock.sendMessage(from, { text: "A aposta deve ser um número inteiro entre 1 e 500 moedas." });
    }
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.moedas < aposta) return sock.sendMessage(from, { text: `Você só tem ${usuario.moedas} 🪙.` });
    usuario.moedas -= aposta;
    await animarCarregamento(sock, from, "🐾 Sorteando o bicho", 2, 250);
    const sorteado = Math.floor(Math.random() * 25) + 1;
    if (palpite === sorteado) {
      const premio = aposta * 20;
      usuario.moedas += premio;
      salvar();
      await sock.sendMessage(from, { text: `🐾 Deu ${BICHOS[sorteado - 1]} (${sorteado})!\n🎉 Você acertou! Prêmio: ${premio} 🪙 | Saldo: ${usuario.moedas} 🪙` });
    } else {
      salvar();
      await sock.sendMessage(from, { text: `🐾 Deu ${BICHOS[sorteado - 1]} (${sorteado}).\n😢 Você perdeu ${aposta} 🪙. Saldo: ${usuario.moedas} 🪙` });
    }
  },

  async adivinhenumero({ sock, from, args, senderJid, nomeUsuario }) {
    const chave = chaveDoJogo(from, senderJid);
    if (!jogosAdivinhacao[chave]) {
      jogosAdivinhacao[chave] = { numero: Math.floor(Math.random() * 100) + 1, tentativas: 0 };
      return sock.sendMessage(from, { text: "🔢 Pensei em um número entre 1 e 100! Tente adivinhar: !adivinhenumero <número>" });
    }
    const palpite = Number(args[0]);
    if (!Number.isSafeInteger(palpite) || palpite < 1 || palpite > 100) {
      return sock.sendMessage(from, { text: "Use um número inteiro entre 1 e 100: !adivinhenumero <número>" });
    }
    const jogo = jogosAdivinhacao[chave];
    jogo.tentativas++;
    if (palpite === jogo.numero) {
      delete jogosAdivinhacao[chave];
      const usuario = pegarUsuario(senderJid, nomeUsuario);
      const premio = Math.max(5, 30 - jogo.tentativas * 2);
      usuario.moedas += premio;
      salvar();
      return sock.sendMessage(from, { text: `🎉 Acertou em ${jogo.tentativas} tentativa(s)! O número era ${jogo.numero}. +${premio} 🪙` });
    }
    await sock.sendMessage(from, { text: palpite < jogo.numero ? "📈 Mais alto!" : "📉 Mais baixo!" });
  },
};

// ===================== SISTEMA DE PETS =====================

const pets = {
  async petadotar({ sock, from, args, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.pet) return sock.sendMessage(from, { text: `Você já tem um pet: ${usuario.pet.emoji} ${usuario.pet.nome}. Use !petabandonar para trocar.` });

    const tipo = (args[0] || "").toLowerCase();
    const nomePet = args.slice(1).join(" ") || "";

    if (!tipo) {
      const lista = PETS_DISPONIVEIS.map((p) => `${p.emoji} ${p.nome} (${p.tipo})`).join("\n");
      return sock.sendMessage(from, { text: `🐾 *PETS DISPONÍVEIS PARA ADOTAR*\n\n${lista}\n\nUse: !petadotar <tipo> <nome>\nEx: !petadotar cachorro Rex` });
    }

    const petBase = PETS_DISPONIVEIS.find((p) => p.tipo === tipo);
    if (!petBase) return sock.sendMessage(from, { text: "Tipo de pet inválido. Use !petlista para ver os disponíveis." });

    const pet = criarPet(tipo, nomePet || petBase.nome);
    usuario.pet = pet;
    registrarProgressoMissao(usuario, "pet");
    salvar();
    const legenda = `🎉 Você adotou ${pet.emoji} *${pet.nome}*!\n❤️ ${pet.vida}/${pet.vidaMax} | ⚔️ ${pet.ataque} | 🛡️ ${pet.defesa} | ⭐ Nível ${pet.nivel}\n\nUse !petperfil para ver os atributos e !petcurar para recuperar vida.`;
    try {
      const imagem = await gerarImagemPet(pet);
      await sock.sendMessage(from, { image: imagem, caption: legenda });
    } catch (erro) {
      console.error("Erro ao gerar cartão do pet:", erro.message);
      await sock.sendMessage(from, { text: legenda });
    }
  },

  async petperfil({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet. Use !petadotar <tipo> <nome> para adotar um!" });

    const pet = usuario.pet;
    cuidarPet(pet);
    salvar();

    const legenda = `${pet.emoji} *${pet.nome}* — ${pet.tipo}, nível ${pet.nivel}\n❤️ Vida: ${pet.vida}/${pet.vidaMax} | 🍖 Fome: ${Math.round(100 - pet.fome)}%\n😊 Felicidade: ${Math.round(pet.felicidade)}% | ⚡ Energia: ${Math.round(pet.energia)}%\n💕 Carinho: ${Math.round(pet.carinho)}% | ⭐ XP: ${pet.xp}/${pet.xpMax}\n⚔️ Ataque: ${pet.ataque} | 🛡️ Defesa: ${pet.defesa}`;
    try {
      const imagem = await gerarImagemPet(pet);
      await sock.sendMessage(from, { image: imagem, caption: legenda });
    } catch (erro) {
      console.error("Erro ao gerar cartão do pet:", erro.message);
      await sock.sendMessage(from, { text: legenda });
    }
  },

  async petalimentar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet. Use !petadotar!" });
    const pet = usuario.pet;
    cuidarPet(pet);
    alimentarPet(pet);
    registrarProgressoMissao(usuario, "pet");
    salvar();
    await sock.sendMessage(from, {
      text: `🍖 ${pet.emoji} ${pet.nome} foi alimentado!\nFome: ${Math.round(100 - pet.fome)}% | Felicidade: ${Math.round(pet.felicidade)}%`,
    });
  },

  async petcurar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você ainda não tem pet. Use !petadotar para adotar um." });
    const custo = 20;
    if (Number(usuario.pet.vida) >= Number(usuario.pet.vidaMax)) {
      return sock.sendMessage(from, { text: `${usuario.pet.emoji} ${usuario.pet.nome} já está com a vida cheia.` });
    }
    if (usuario.moedas < custo) return sock.sendMessage(from, { text: `A cura custa ${custo} 🪙. Seu saldo: ${usuario.moedas} 🪙.` });
    const curado = curarPet(usuario.pet, 30);
    if (curado === 0) return sock.sendMessage(from, { text: `${usuario.pet.emoji} ${usuario.pet.nome} já está com a vida cheia.` });
    usuario.moedas -= custo;
    registrarProgressoMissao(usuario, "pet");
    salvar();
    await sock.sendMessage(from, {
      text: `💚 ${usuario.pet.nome} recuperou ${curado} de vida por ${custo} 🪙.\n❤️ ${usuario.pet.vida}/${usuario.pet.vidaMax} | Saldo: ${usuario.moedas} 🪙`,
    });
  },

  async petbrincar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet. Use !petadotar!" });
    const pet = usuario.pet;
    cuidarPet(pet);
    if (pet.energia < 15) return sock.sendMessage(from, { text: `${pet.emoji} ${pet.nome} está muito cansado para brincar. Alimente-o primeiro!` });
    const result = brincarPet(pet);
    registrarProgressoMissao(usuario, "pet");
    salvar();
    let texto = `🎾 ${pet.emoji} ${pet.nome} adorou brincar!\nCarinho: ${Math.round(pet.carinho)}% | Felicidade: ${Math.round(pet.felicidade)}%`;
    if (result.subiuNivel) texto += `\n\n⭐ *${pet.nome} subiu para o nível ${pet.nivel}!*`;
    await sock.sendMessage(from, { text: texto });
  },

  async pettreinar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet. Use !petadotar!" });
    const pet = usuario.pet;
    cuidarPet(pet);
    if (pet.energia < 25) return sock.sendMessage(from, { text: `${pet.emoji} ${pet.nome} está muito cansado para treinar. Alimente-o primeiro!` });
    const result = treinarPet(pet);
    registrarProgressoMissao(usuario, "pet");
    salvar();
    let texto = `💪 ${pet.emoji} ${pet.nome} treinou duro!\nAtaque: ${pet.ataque} | Defesa: ${pet.defesa} | Energia: ${Math.round(pet.energia)}%`;
    if (result.subiuNivel) texto += `\n\n⭐ *${pet.nome} subiu para o nível ${pet.nivel}!*`;
    await sock.sendMessage(from, { text: texto });
  },

  async petbatalhar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet. Use !petadotar!" });

    const pet = usuario.pet;
    cuidarPet(pet);
    if (pet.vida <= 0) return sock.sendMessage(from, { text: `${pet.emoji} ${pet.nome} está sem vida! Alimente e cuide dele primeiro.` });
    if (pet.energia < 15) return sock.sendMessage(from, { text: `${pet.emoji} ${pet.nome} está sem energia. Espere recuperar ou alimente-o.` });

    await animarCarregamento(sock, from, `⚔️ ${pet.nome} entrando em batalha`, 2, 300);
    const monstro = sortearMonstro(pet.nivel);
    const bonusCarinho = pet.carinho >= 80 && pet.felicidade >= 60 ? 1.15 : 1;
    const petEmBatalha = { ...pet, ataque: Math.round(pet.ataque * bonusCarinho) };
    const resultado = batalhar(petEmBatalha, monstro);
    pet.vida = resultado.vidaFinalJogador;
    pet.energia = Math.max(0, pet.energia - 15);

    let texto = `${monstro.emoji} *${monstro.nome} apareceu!*\n\n`;
    texto += resultado.log.slice(0, 6).join("\n") + "\n\n";

    if (resultado.venceu) {
      const resultadoXp = ganharXpPet(pet, monstro.xp);
      usuario.moedas += monstro.ouro;
      registrarProgressoMissao(usuario, "pet");
      texto += `🎉 ${pet.nome} venceu! +${monstro.xp} XP e +${monstro.ouro} 🪙`;
      if (bonusCarinho > 1) texto += "\n💕 O vínculo deu 15% de bônus de ataque.";
      if (resultadoXp.subiuNivel) texto += `\n⭐ Subiu para o nível ${pet.nivel}!`;
    } else {
      texto += `💀 ${pet.nome} foi derrotado... Use !petcurar para recuperar vida.`;
    }

    salvar();
    await sock.sendMessage(from, { text: texto });
  },

  async petrenomear({ sock, from, args, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet. Use !petadotar!" });
    const novoNome = args.join(" ");
    if (!novoNome) return sock.sendMessage(from, { text: "Use: !petrenomear <novo nome>" });
    const nomeAntigo = usuario.pet.nome;
    usuario.pet.nome = novoNome.slice(0, 30);
    salvar();
    await sock.sendMessage(from, { text: `✅ ${usuario.pet.emoji} ${nomeAntigo} agora se chama *${usuario.pet.nome}*!` });
  },

  async petabandonar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet." });
    const nome = usuario.pet.nome;
    usuario.pet = null;
    salvar();
    await sock.sendMessage(from, { text: `💔 Você abandonou ${nome}... Que pena. Use !petadotar para adotar um novo pet.` });
  },

  async petlista({ sock, from }) {
    const lista = PETS_DISPONIVEIS.map((p) =>
      `${p.emoji} ${p.nome} (${p.tipo})\n   ❤️ ${p.vidaMax} | ⚔️ ${p.ataque} | 🛡️ ${p.defesa}`
    ).join("\n\n");
    await sock.sendMessage(from, {
      text: `🐾 *PETS DISPONÍVEIS*\n\n${lista}\n\nUse: !petadotar <tipo> <nome>`,
    });
  },
};

// ===================== BATALHAS =====================

const batalhas = {
  async batalhagolpes({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.rpg) return sock.sendMessage(from, { text: "Você não tem personagem. Use !rpgcriar <nome> <classe>!" });
    const p = usuario.rpg;
    if (p.vida <= 0) return sock.sendMessage(from, { text: "Você está sem vida! Use !rpgcurar antes de batalhar." });

    await animarCarregamento(sock, from, "⚔️ Procurando inimigo", 2, 300);
    const monstro = sortearMonstro(p.nivel);

    // Batalha por golpes com turnos
    const estado = iniciarBatalhaGolpes(p, monstro);
    const log = [`⚔️ *BATALHA POR GOLPES*\n${p.emoji} ${p.nome} vs ${monstro.emoji} ${monstro.nome}\n\n`];

    const poderes = CLASSES_RPG[p.classe]?.poderes || [];
    // Joga automaticamente: alterna entre poderes
    let rodada = 0;
    while (!estado.venceu && !estado.perdeu && rodada < 10) {
      rodada++;
      // Escolhe poder baseado em mana disponível
      const poderesDisponiveis = poderes.filter((pw) => estado.mana >= (pw.custo || 0));
      const poder = poderesDisponiveis[Math.floor(Math.random() * poderesDisponiveis.length)] || poderes[0];
      const resultado = executarGolpe(estado, p, monstro, poder.id);
      if (resultado.erro) { estado.mana += 10; continue; }
      log.push(...resultado.log);

      if (estado.mana < 10) estado.mana += 15; // regen extra
    }

    if (estado.venceu) {
      const subiuNivel = ganharXp(p, monstro.xp);
      p.vida = estado.vidaJogador;
      p.ouro += monstro.ouro;
      log.push(`\n🎉 Vitória! +${monstro.xp} XP, +${monstro.ouro} 🪙`);
      if (subiuNivel) log.push(`\n⭐ *SUBIU DE NÍVEL! Agora é nível ${p.nivel}!*`);
    } else if (estado.perdeu) {
      p.vida = 0;
      log.push(`\n💀 Derrota... Use !rpgcurar para se recuperar.`);
    } else {
      // Timeout — decide por vida
      if (estado.vidaJogador > estado.vidaMonstro) {
        const subiuNivel = ganharXp(p, Math.floor(monstro.xp / 2));
        p.vida = estado.vidaJogador;
        log.push(`\n⏱️ Tempo esgotado, mas você tinha mais vida! Vitória parcial. +${Math.floor(monstro.xp / 2)} XP`);
        if (subiuNivel) log.push(`\n⭐ *SUBIU DE NÍVEL! Agora é nível ${p.nivel}!*`);
      } else {
        p.vida = estado.vidaJogador;
        log.push(`\n⏱️ Tempo esgotado. Derrota por desgaste.`);
      }
    }

    salvar();
    await sock.sendMessage(from, { text: log.join("\n") });
  },

  async batalhamembros({ sock, from, msg, senderJid, nomeUsuario }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length < 2) {
      return sock.sendMessage(from, { text: "Use: !batalhamembros @pessoa1 @pessoa2" });
    }

    const p1Jid = mencionados[0];
    const p2Jid = mencionados[1];
    const p1 = pegarUsuario(p1Jid, undefined);
    const p2 = pegarUsuario(p2Jid, undefined);

    // Usa stats do RPG se tiver, senão cria stats padrão
    const stats1 = p1.rpg || { nome: p1.nome, vida: 100, vidaMax: 100, ataque: 15, defesa: 10, emoji: "🧑", classe: "lutador" };
    const stats2 = p2.rpg || { nome: p2.nome, vida: 100, vidaMax: 100, ataque: 15, defesa: 10, emoji: "🧑", classe: "lutador" };

    await animarCarregamento(sock, from, "⚔️ Preparando batalha", 2, 300);

    const resultado = batalharMembros(stats1, stats2);

    let texto = `⚔️ *BATALHA: MEMBRO VS MEMBRO*\n\n`;
    texto += `${stats1.emoji || "🧑"} ${stats1.nome} vs ${stats2.emoji || "🧑"} ${stats2.nome}\n\n`;
    texto += resultado.log.join("\n") + "\n\n";

    // Vencedor ganha moedas
    const vencedor = resultado.vencedor;
    const vencedorJid = vencedor === stats1 ? p1Jid : p2Jid;
    const vencedorUser = pegarUsuario(vencedorJid, undefined);
    const premio = 20;
    vencedorUser.moedas += premio;
    salvar();

    texto += `🏆 Vencedor: *${vencedor.nome || "Jogador"}* (+${premio} 🪙)\n`;
    texto += `❤️ Vida restante: ${resultado.vidaFinal1} vs ${resultado.vidaFinal2}`;

    await sock.sendMessage(from, {
      text: texto,
      mentions: [p1Jid, p2Jid],
    });
  },

  async batalhamonstros({ sock, from }) {
    await animarCarregamento(sock, from, "⚔️ Invocando monstros", 2, 300);

    // Sorteia dois monstros diferentes
    const monstro1 = escolher(MONSTROS);
    let monstro2 = escolher(MONSTROS);
    while (monstro2 === monstro1) monstro2 = escolher(MONSTROS);

    const resultado = batalharMonstros({ ...monstro1 }, { ...monstro2 });

    let texto = `🐉 *BATALHA: MONSTRO VS MONSTRO*\n\n`;
    texto += `${monstro1.emoji} ${monstro1.nome} vs ${monstro2.emoji} ${monstro2.nome}\n\n`;
    texto += resultado.log.join("\n") + "\n\n";
    texto += `🏆 Vencedor: *${resultado.vencedor.emoji} ${resultado.vencedor.nome}*`;

    await sock.sendMessage(from, { text: texto });
  },

  async batalhadinamica({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.rpg) return sock.sendMessage(from, { text: "Você não tem personagem. Use !rpgcriar <nome> <classe>!" });
    const p = usuario.rpg;
    if (p.vida <= 0) return sock.sendMessage(from, { text: "Você está sem vida! Use !rpgcurar antes de batalhar." });

    // Verifica se já tem batalha ativa
    const batalhaExistente = obterBatalhaDinamica(from, senderJid);
    if (batalhaExistente && batalhaExistente.ativo) {
      const poderes = CLASSES_RPG[p.classe]?.poderes || [];
      const estadoB = batalhaExistente;
      // Usa lista para mais de 3 poderes, botões para 3 ou menos
      if (poderes.length > 3) {
        const itens = poderes.map((pw) => ({
          id: `!rpgacao ${pw.id}`,
          titulo: `${pw.emoji} ${pw.nome}`,
          descricao: pw.custo ? `${pw.custo} mana` : "Gratuito",
        }));
        await enviarLista(sock, from, "⚔️ Escolha seu poder", `⚔️ *BATALHA DINÂMICA — Rodada ${estadoB.rodada}*

❤️ Você: ${estadoB.vidaJogador}/${p.vidaMax} HP
⚡ Mana: ${estadoB.mana}/${estadoB.manaMax}
${estadoB.monstro.emoji} ${estadoB.monstro.nome}: ${estadoB.vidaMonstro} HP`, itens);
      } else {
        const botoes = poderes.map((pw) => ({
          id: `!rpgacao ${pw.id}`,
          texto: `${pw.emoji} ${pw.nome}${pw.custo ? ` (${pw.custo} mana)` : ""}`,
        }));
        await enviarComBotoes(sock, from,
          `⚔️ *BATALHA DINÂMICA — Rodada ${estadoB.rodada}*

❤️ Você: ${estadoB.vidaJogador}/${p.vidaMax} HP
⚡ Mana: ${estadoB.mana}/${estadoB.manaMax}
${estadoB.monstro.emoji} ${estadoB.monstro.nome}: ${estadoB.vidaMonstro} HP

Escolha sua ação:`,
          botoes
        );
      }
      return;
    }

    // Inicia nova batalha
    await animarCarregamento(sock, from, "⚔️ Iniciando batalha dinâmica", 2, 300);
    const monstro = sortearMonstro(p.nivel);
    const estado = iniciarBatalhaDinamica(from, senderJid, p, monstro);

    const poderes = CLASSES_RPG[p.classe]?.poderes || [];
    if (poderes.length > 3) {
      const itens = poderes.map((pw) => ({
        id: `!rpgacao ${pw.id}`,
        titulo: `${pw.emoji} ${pw.nome}`,
        descricao: pw.custo ? `${pw.custo} mana` : "Gratuito",
      }));
      await enviarLista(sock, from, "⚔️ Escolha seu poder", `⚔️ *BATALHA DINÂMICA INICIADA!*

${p.emoji} ${p.nome} vs ${monstro.emoji} ${monstro.nome}

❤️ Você: ${estado.vidaJogador}/${p.vidaMax} HP
⚡ Mana: ${estado.mana}/${estado.manaMax}
${monstro.emoji} ${monstro.nome}: ${estado.vidaMonstro} HP`, itens);
    } else {
      const botoes = poderes.map((pw) => ({
        id: `!rpgacao ${pw.id}`,
        texto: `${pw.emoji} ${pw.nome}${pw.custo ? ` (${pw.custo} mana)` : ""}`,
      }));
      await enviarComBotoes(sock, from,
        `⚔️ *BATALHA DINÂMICA INICIADA!*

${p.emoji} ${p.nome} vs ${monstro.emoji} ${monstro.nome}

❤️ Você: ${estado.vidaJogador}/${p.vidaMax} HP
⚡ Mana: ${estado.mana}/${estado.manaMax}
${monstro.emoji} ${monstro.nome}: ${estado.vidaMonstro} HP

Escolha sua ação:`,
        botoes
      );
    }
  },

  async rpgacao({ sock, from, args, senderJid, nomeUsuario }) {
    const acao = (args[0] || "").toLowerCase();
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.rpg) return sock.sendMessage(from, { text: "Você não tem personagem. Use !rpgcriar!" });

    const estado = obterBatalhaDinamica(from, senderJid);
    if (!estado || !estado.ativo) return sock.sendMessage(from, { text: "Nenhuma batalha ativa. Use !batalhadinamica para começar." });

    const resultado = acaoBatalhaDinamica(from, senderJid, acao);
    if (resultado.erro) return sock.sendMessage(from, { text: `❌ ${resultado.erro}` });

    const p = usuario.rpg;
    const poderes = CLASSES_RPG[p.classe]?.poderes || [];

    if (resultado.venceu) {
      const subiuNivel = ganharXp(p, estado.monstro.xp);
      p.vida = estado.vidaJogador;
      salvar();
      encerrarBatalhaDinamica(from, senderJid);

      let texto = resultado.log.join("\n") + "\n\n";
      p.ouro += estado.monstro.ouro;
      texto += `🎉 Vitória! +${estado.monstro.xp} XP, +${estado.monstro.ouro} 🪙`;
      if (subiuNivel) texto += `\n\n⭐ *SUBIU DE NÍVEL! Agora é nível ${p.nivel}!*`;
      await sock.sendMessage(from, { text: texto });
      return;
    }

    if (resultado.perdeu) {
      p.vida = 0;
      salvar();
      encerrarBatalhaDinamica(from, senderJid);
      await sock.sendMessage(from, { text: resultado.log.join("\n") + "\n\n💀 Derrota... Use !rpgcurar para se recuperar." });
      return;
    }

    // Continua a batalha — envia botões ou lista
    if (poderes.length > 3) {
      const itens = poderes.map((pw) => ({
        id: `!rpgacao ${pw.id}`,
        titulo: `${pw.emoji} ${pw.nome}`,
        descricao: pw.custo ? `${pw.custo} mana` : "Gratuito",
      }));
      await enviarLista(sock, from, "⚔️ Escolha seu poder",
        `⚔️ *Rodada ${resultado.estado.rodada}*\n\n` +
        resultado.log.join("\n") + "\n\n" +
        `❤️ Você: ${resultado.estado.vidaJogador}/${p.vidaMax} HP\n` +
        `⚡ Mana: ${resultado.estado.mana}/${resultado.estado.manaMax}\n` +
        `${resultado.estado.monstro.emoji} ${resultado.estado.monstro.nome}: ${resultado.estado.vidaMonstro} HP`, itens);
    } else {
      const botoes = poderes.map((pw) => ({
        id: `!rpgacao ${pw.id}`,
        texto: `${pw.emoji} ${pw.nome}${pw.custo ? ` (${pw.custo} mana)` : ""}`,
      }));
      await enviarComBotoes(sock, from,
        `⚔️ *Rodada ${resultado.estado.rodada}*\n\n` +
        resultado.log.join("\n") + "\n\n" +
        `❤️ Você: ${resultado.estado.vidaJogador}/${p.vidaMax} HP\n` +
        `⚡ Mana: ${resultado.estado.mana}/${resultado.estado.manaMax}\n` +
        `${resultado.estado.monstro.emoji} ${resultado.estado.monstro.nome}: ${resultado.estado.vidaMonstro} HP\n\n` +
        `Escolha sua ação:`,
        botoes
      );
    }
  },

  async fugirbatalha({ sock, from, senderJid, nomeUsuario }) {
    const estado = obterBatalhaDinamica(from, senderJid);
    if (!estado || !estado.ativo) return sock.sendMessage(from, { text: "Nenhuma batalha ativa para fugir." });

    encerrarBatalhaDinamica(from, senderJid);
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.rpg) {
      usuario.rpg.vida = Math.max(1, Math.floor(usuario.rpg.vidaMax * 0.3));
      salvar();
    }
    await sock.sendMessage(from, { text: "🏃 Você fugiu da batalha! Perdeu parte da vida ao escapar." });
  },
};

// ===================== ADMIN DE GRUPO =====================

const admin = {
  async remover({ sock, from, msg, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Marca quem deve ser removido: !remover @pessoa" });
    await sock.groupParticipantsUpdate(from, mencionados, "remove");
  },

  async fechargrupo({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    await sock.groupSettingUpdate(from, "announcement");
    await sock.sendMessage(from, { text: "🔒 Grupo fechado — só admins podem enviar mensagens." });
  },

  async abrirgrupo({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    await sock.groupSettingUpdate(from, "not_announcement");
    await sock.sendMessage(from, { text: "🔓 Grupo aberto — todos podem enviar mensagens." });
  },

  async mutar({ sock, from, msg, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Marca quem deve ser mutado: !mutar @pessoa" });
    const grupo = pegarGrupo(from);
    for (const jid of mencionados) { if (!grupo.mutados.includes(jid)) grupo.mutados.push(jid); }
    salvar();
    await sock.sendMessage(from, { text: `🔇 Mensagens de @${mencionados[0].split("@")[0]} serão removidas automaticamente.`, mentions: mencionados });
  },

  async desmutar({ sock, from, msg, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Marca quem deve ser desmutado: !desmutar @pessoa" });
    const grupo = pegarGrupo(from);
    grupo.mutados = grupo.mutados.filter((jid) => !mencionados.includes(jid));
    salvar();
    await sock.sendMessage(from, { text: `🔊 @${mencionados[0].split("@")[0]} pode falar de novo.`, mentions: mencionados });
  },

  async avisar({ sock, from, msg, args, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !avisar @pessoa <motivo>" });
    const alvo = mencionados[0];
    const motivo = args.filter((a) => !a.startsWith("@")).join(" ") || "sem motivo especificado";
    const usuarioAlvo = pegarUsuario(alvo, undefined);
    usuarioAlvo.avisos = (usuarioAlvo.avisos || 0) + 1;
    salvar();
    if (usuarioAlvo.avisos >= 3) {
      await sock.sendMessage(from, { text: `⚠️ @${alvo.split("@")[0]} chegou a 3 avisos e foi removido do grupo.`, mentions: [alvo] });
      try { await sock.groupParticipantsUpdate(from, [alvo], "remove"); } catch (erro) { console.error("Erro ao remover após 3 avisos:", erro); }
      usuarioAlvo.avisos = 0;
      salvar();
    } else {
      await sock.sendMessage(from, { text: `⚠️ Aviso ${usuarioAlvo.avisos}/3 para @${alvo.split("@")[0]}: ${motivo}`, mentions: [alvo] });
    }
  },

  async promover({ sock, from, msg, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Marca quem deve ser promovido: !promover @pessoa" });
    await sock.groupParticipantsUpdate(from, mencionados, "promote");
    await sock.sendMessage(from, { text: `⬆️ @${mencionados[0].split("@")[0]} agora é admin!`, mentions: mencionados });
  },

  async rebaixar({ sock, from, msg, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Marca quem deve ser rebaixado: !rebaixar @pessoa" });
    await sock.groupParticipantsUpdate(from, mencionados, "demote");
    await sock.sendMessage(from, { text: `⬇️ @${mencionados[0].split("@")[0]} não é mais admin.`, mentions: mencionados });
  },

  async antilink({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const grupo = pegarGrupo(from);
    grupo.antilink = !grupo.antilink;
    salvar();
    await sock.sendMessage(from, { text: grupo.antilink ? "🔗🚫 Antilink ativado! Links de quem não é admin serão apagados." : "🔗 Antilink desativado." });
  },

  async antinsfw({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const grupo = pegarGrupo(from);
    grupo.antiNsfw = !grupo.antiNsfw;
    salvar();
    await sock.sendMessage(from, {
      text: grupo.antiNsfw
        ? "🔞 Anti-NSFW ativado. Vou filtrar termos e links explícitos em mensagens e legendas; mídia sem texto precisa de um classificador visual."
        : "🔞 Anti-NSFW desativado.",
    });
  },

  async antitravazap({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const grupo = pegarGrupo(from);
    grupo.antiTravaZap = !grupo.antiTravaZap;
    salvar();
    await sock.sendMessage(from, {
      text: grupo.antiTravaZap
        ? "🛡️ Anti-trava-zap ativado. Mensagens excessivas, muito aninhadas ou com payload complexo serão bloqueadas."
        : "🛡️ Anti-trava-zap desativado.",
    });
  },

  async marcartodos({ sock, from, args, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const metadata = await sock.groupMetadata(from);
    const todos = metadata.participants.map((p) => p.id);
    const aviso = args.join(" ") || "📢 Atenção, pessoal!";
    await sock.sendMessage(from, { text: `${aviso}\n\n${todos.map((jid) => `@${jid.split("@")[0]}`).join(" ")}`, mentions: todos });
  },

  async grupolink({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    try {
      const codigo = await sock.groupInviteCode(from);
      await sock.sendMessage(from, { text: `🔗 https://chat.whatsapp.com/${codigo}` });
    } catch {
      await sock.sendMessage(from, { text: "Não consegui gerar o link (o bot precisa ser admin)." });
    }
  },

  async revogarlink({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    try {
      const novoCodigo = await sock.groupRevokeInvite(from);
      await sock.sendMessage(from, { text: `🔄 Link antigo revogado! Novo link:\nhttps://chat.whatsapp.com/${novoCodigo}` });
    } catch {
      await sock.sendMessage(from, { text: "Não consegui revogar o link (o bot precisa ser admin)." });
    }
  },

  async apagar({ sock, from, msg, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const contexto = msg.message?.extendedTextMessage?.contextInfo;
    if (!contexto?.stanzaId) return sock.sendMessage(from, { text: "Responda (reply) a mensagem que quer apagar com !apagar" });
    try {
      await sock.sendMessage(from, { delete: { remoteJid: from, id: contexto.stanzaId, participant: contexto.participant, fromMe: false } });
    } catch (erro) {
      console.error("Erro ao apagar mensagem:", erro);
      await sock.sendMessage(from, { text: "Não consegui apagar (o bot precisa ser admin)." });
    }
  },

  async definirnome({ sock, from, args, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const nome = args.join(" ");
    if (!nome) return sock.sendMessage(from, { text: "Use: !definirnome <novo nome do grupo>" });
    try {
      await sock.groupUpdateSubject(from, nome);
      await sock.sendMessage(from, { text: `✅ Nome do grupo alterado para: ${nome}` });
    } catch {
      await sock.sendMessage(from, { text: "Não consegui mudar o nome (o bot precisa ser admin)." });
    }
  },

  async definirdescricao({ sock, from, args, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const texto = args.join(" ");
    if (!texto) return sock.sendMessage(from, { text: "Use: !definirdescricao <novo texto>" });
    try {
      await sock.groupUpdateDescription(from, texto);
      await sock.sendMessage(from, { text: "✅ Descrição do grupo atualizada." });
    } catch {
      await sock.sendMessage(from, { text: "Não consegui mudar a descrição (o bot precisa ser admin)." });
    }
  },

  async boasvindas({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const grupo = pegarGrupo(from);
    grupo.boasVindas = !grupo.boasVindas;
    salvar();
    await sock.sendMessage(from, { text: grupo.boasVindas ? "👋 Boas-vindas ativadas." : "🔕 Boas-vindas desativadas." });
  },

  async regras({ sock, from, args, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Esse comando só funciona em grupos." });
    const texto = args.join(" ");
    if (!texto) return sock.sendMessage(from, { text: "Use: !regras <texto com as regras do grupo>" });
    const grupo = pegarGrupo(from);
    grupo.regras = texto;
    salvar();
    await sock.sendMessage(from, { text: "✅ Regras do grupo atualizadas! Use !verregras pra conferir." });
  },
};

admin.antinfsw = admin.antinsfw;

// ===================== COMANDOS DO DONO =====================

const dono = {
  async ligarbot({ sock, from }) { db.botLigado = true; salvar(); await sock.sendMessage(from, { text: "✅ Bot ligado globalmente." }); },
  async desligarbot({ sock, from }) { db.botLigado = false; salvar(); await sock.sendMessage(from, { text: "⛔ Bot desligado globalmente." }); },
  async autorizargrupo({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Use esse comando dentro do grupo que deseja autorizar." });
    pegarGrupo(from).autorizado = true; salvar();
    await sock.sendMessage(from, { text: "✅ Grupo autorizado! O bot agora responde por aqui." });
  },
  async desautorizargrupo({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Use esse comando dentro do grupo que deseja desautorizar." });
    pegarGrupo(from).autorizado = false; salvar();
    await sock.sendMessage(from, { text: "⛔ Grupo desautorizado. O bot não vai mais responder aqui." });
  },
  async iaativar({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Use dentro do grupo desejado." });
    pegarGrupo(from).iaAtiva = true; salvar();
    await sock.sendMessage(from, { text: "🧠 IA ativada neste grupo (gatilho: palavra 'Kok' ou 'Miku')." });
  },
  async iadesativar({ sock, from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: "Use dentro do grupo desejado." });
    pegarGrupo(from).iaAtiva = false; salvar();
    await sock.sendMessage(from, { text: "🧠 IA desativada neste grupo." });
  },
  async transmitir({ sock, from, args }) {
    const mensagem = args.join(" ");
    if (!mensagem) return sock.sendMessage(from, { text: "Use: !transmitir <mensagem>" });
    const gruposAutorizados = Object.entries(db.grupos).filter(([, g]) => g.autorizado).map(([jid]) => jid);
    for (const jid of gruposAutorizados) { await sock.sendMessage(jid, { text: `📢 *Aviso do dono:*\n${mensagem}` }); }
    await sock.sendMessage(from, { text: `✅ Mensagem enviada para ${gruposAutorizados.length} grupo(s).` });
  },
  async stats({ sock, from }) {
    const totalUsuarios = Object.keys(db.usuarios).length;
    const totalGrupos = Object.keys(db.grupos).length;
    const gruposAutorizados = Object.values(db.grupos).filter((g) => g.autorizado).length;
    const totalMensagens = Object.values(db.usuarios).reduce((soma, u) => soma + u.mensagens, 0);
    const tamanhoIA = Object.values(db.cadeiaAprendizado || {}).reduce((s, r) => s + Object.keys(r).length, 0);
    await sock.sendMessage(from, {
      text: `📊 *ESTATÍSTICAS DO BOT*\n\n👥 Usuários registrados: ${totalUsuarios}\n👨‍👩‍👧 Grupos conhecidos: ${totalGrupos} (${gruposAutorizados} autorizados)\n💬 Mensagens processadas: ${totalMensagens}\n🧠 Conhecimento da IA: ${tamanhoIA} combinações\n🔌 Bot ligado: ${db.botLigado ? "Sim" : "Não"}\n🧠 IA: 100% local (sem APIs)`,
    });
  },
  async resetuser({ sock, from, msg }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !resetuser @pessoa" });
    const alvo = mencionados[0];
    if (db.usuarios[alvo]) {
      const nomeAntigo = db.usuarios[alvo].nome;
      delete db.usuarios[alvo]; salvar();
      await sock.sendMessage(from, { text: `♻️ Perfil de ${nomeAntigo} foi resetado.` });
    } else {
      await sock.sendMessage(from, { text: "Essa pessoa não tem perfil registrado." });
    }
  },
  async addmoedas({ sock, from, msg, args }) {
    const mencionados = pegarMencionados(msg);
    const quantidade = parseInt(args.find((a) => !a.startsWith("@")), 10);
    if (mencionados.length === 0 || !quantidade) return sock.sendMessage(from, { text: "Use: !addmoedas @pessoa <quantidade>" });
    const usuario = pegarUsuario(mencionados[0], undefined);
    usuario.moedas += quantidade; salvar();
    await sock.sendMessage(from, { text: `✅ +${quantidade} 🪙 pra ${usuario.nome}. Saldo: ${usuario.moedas} 🪙` });
  },
  async removermoedas({ sock, from, msg, args }) {
    const mencionados = pegarMencionados(msg);
    const quantidade = parseInt(args.find((a) => !a.startsWith("@")), 10);
    if (mencionados.length === 0 || !quantidade) return sock.sendMessage(from, { text: "Use: !removermoedas @pessoa <quantidade>" });
    const usuario = pegarUsuario(mencionados[0], undefined);
    usuario.moedas = Math.max(0, usuario.moedas - quantidade); salvar();
    await sock.sendMessage(from, { text: `✅ -${quantidade} 🪙 de ${usuario.nome}. Saldo: ${usuario.moedas} 🪙` });
  },
  async setnivel({ sock, from, msg, args }) {
    const mencionados = pegarMencionados(msg);
    const nivel = parseInt(args.find((a) => !a.startsWith("@")), 10);
    if (mencionados.length === 0 || !nivel || nivel < 1) return sock.sendMessage(from, { text: "Use: !setnivel @pessoa <nível>" });
    const usuario = pegarUsuario(mencionados[0], undefined);
    usuario.nivel = nivel; usuario.xp = 0; salvar();
    await sock.sendMessage(from, { text: `✅ ${usuario.nome} agora está no nível ${nivel}.` });
  },
  async addvip({ sock, from, msg }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !addvip @pessoa" });
    const usuario = pegarUsuario(mencionados[0], undefined);
    usuario.titulo = "💎 VIP"; salvar();
    await sock.sendMessage(from, { text: `💎 ${usuario.nome} agora é VIP!` });
  },
  async removervip({ sock, from, msg }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !removervip @pessoa" });
    const usuario = pegarUsuario(mencionados[0], undefined);
    usuario.titulo = null; salvar();
    await sock.sendMessage(from, { text: `✅ VIP removido de ${usuario.nome}.` });
  },
  async banir({ sock, from, msg, senderJid }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !banir @pessoa" });
    const alvo = mencionados[0];
    if (ehDono(alvo, numerosDonoExibicao)) return sock.sendMessage(from, { text: "Não dá pra banir outro dono do bot 😅" });
    const usuario = pegarUsuario(alvo, undefined);
    usuario.banido = true; salvar();
    await sock.sendMessage(from, { text: `🚫 ${usuario.nome} foi banido.` });
  },
  async desbanir({ sock, from, msg }) {
    const mencionados = pegarMencionados(msg);
    if (mencionados.length === 0) return sock.sendMessage(from, { text: "Use: !desbanir @pessoa" });
    const usuario = pegarUsuario(mencionados[0], undefined);
    usuario.banido = false; salvar();
    await sock.sendMessage(from, { text: `✅ ${usuario.nome} foi desbanido.` });
  },
  async listagrupos({ sock, from }) {
    const entradas = Object.entries(db.grupos);
    if (entradas.length === 0) return sock.sendMessage(from, { text: "Nenhum grupo conhecido ainda." });
    const texto = entradas.map(([jid, g], i) => `${i + 1}. ${g.autorizado ? "✅" : "❌"} ${jid.split("@")[0]}`).join("\n");
    await sock.sendMessage(from, { text: `📋 *GRUPOS CONHECIDOS*\n${texto}` });
  },
  async listadonos({ sock, from }) {
    await sock.sendMessage(from, { text: `👑 *DONOS DO BOT*\n${numerosDonoExibicao.map((n) => `+${n}`).join("\n")}` });
  },
  async manutencao({ sock, from, args }) {
    db.manutencao.ativa = !db.manutencao.ativa;
    const mensagemCustom = args.join(" ");
    if (mensagemCustom) db.manutencao.mensagem = mensagemCustom;
    salvar();
    await sock.sendMessage(from, {
      text: db.manutencao.ativa
        ? `🔧 Modo manutenção ATIVADO. Só donos conseguem usar o bot agora.\nMensagem: "${db.manutencao.mensagem}"`
        : "✅ Modo manutenção desativado. Bot liberado pra todo mundo de novo.",
    });
  },
  async versao({ sock, from }) {
    const totalComandos = Object.keys(TODOS_COMANDOS).length;
    await sock.sendMessage(from, {
      text: `🤖 *${NOME_BOT}* v5.0\nNode.js + Baileys\nIA: 100% local (sem APIs)\nComandos disponíveis: ${totalComandos}\nBot ligado: ${db.botLigado ? "Sim" : "Não"}\nManutenção: ${db.manutencao.ativa ? "Ativa" : "Inativa"}`,
    });
  },
  async reiniciar({ sock, from }) {
    await sock.sendMessage(from, { text: "🔄 Reiniciando..." });
    setTimeout(() => process.exit(1), 1000);
  },
};

// ===================== RPG =====================

const rpg = {
  async rpgcriar({ sock, from, args, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (usuario.rpg) return sock.sendMessage(from, { text: `Você já tem um personagem: ${usuario.rpg.emoji} ${usuario.rpg.nome}. Use !rpgresetar pra recomeçar.` });
    const classeId = (args[args.length - 1] || "").toLowerCase();
    const nomePersonagem = args.slice(0, -1).join(" ");
    if (!CLASSES_RPG[classeId] || !nomePersonagem) {
      const listaClasses = Object.entries(CLASSES_RPG).map(([id, c]) => `${c.emoji} ${c.nome} (${id})`).join("\n");
      return sock.sendMessage(from, {
        text: `╭──────────────╮\n   🗡️ *CRIAR PERSONAGEM*\n╰──────────────╯\nUse: !rpgcriar <nome> <classe>\n\nClasses disponíveis:\n${listaClasses}\n\nCada classe tem poderes únicos para batalhas!\n\nEx: !rpgcriar Thoren guerreiro`,
      });
    }
    usuario.rpg = criarPersonagem(nomePersonagem, classeId);
    salvar();
    await sock.sendMessage(from, {
      text: `🎉 Personagem criado!\n${usuario.rpg.emoji} *${usuario.rpg.nome}* — ${usuario.rpg.classeNome}\n\nStats:\n❤️ Vida: ${usuario.rpg.vida}/${usuario.rpg.vidaMax}\n⚔️ Ataque: ${usuario.rpg.ataque}\n🛡️ Defesa: ${usuario.rpg.defesa}\n⚡ Mana: ${usuario.rpg.mana}/${usuario.rpg.manaMax}\n\nUse !rpgperfil pra ver a ficha e !rpgbatalhar pra começar!`,
    });
  },

  async rpgperfil({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.rpg) return sock.sendMessage(from, { text: "Você ainda não tem personagem. Use !rpgcriar <nome> <classe>!" });
    const p = usuario.rpg;
    try {
      const imagem = await gerarImagemRPG({ nome: p.nome, classeEmoji: p.emoji, nivel: p.nivel, vida: p.vida, vidaMax: p.vidaMax, ataque: p.ataque, defesa: p.defesa, ouro: p.ouro });
      const poderes = CLASSES_RPG[p.classe]?.poderes || [];
      const textoPoderes = poderes.map((pw) => `${pw.emoji} ${pw.nome}${pw.custo ? ` (${pw.custo} mana)` : ""}`).join("\n");
      await sock.sendMessage(from, { image: imagem, caption: `${p.emoji} *${p.nome}* — ${p.classeNome}\nNível ${p.nivel} | XP: ${p.xp}/${p.xpMax} | Mana: ${p.mana}/${p.manaMax}\n\nPoderes:\n${textoPoderes}` });
    } catch (erro) {
      console.error("Erro na imagem do RPG:", erro);
      await sock.sendMessage(from, { text: `${p.emoji} *${p.nome}* — ${p.classeNome} (Nível ${p.nivel})\n❤️ ${p.vida}/${p.vidaMax}\n⚡ Mana: ${p.mana}/${p.manaMax}\n⚔️ Ataque: ${p.ataque}\n🛡️ Defesa: ${p.defesa}\n🪙 Ouro: ${p.ouro}\nXP: ${p.xp}/${p.xpMax}` });
    }
  },

  async rpgbatalhar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.rpg) return sock.sendMessage(from, { text: "Você ainda não tem personagem. Use !rpgcriar!" });
    const p = usuario.rpg;
    if (p.vida <= 0) return sock.sendMessage(from, { text: "Você está sem vida! Use !rpgcurar antes de batalhar." });
    await animarCarregamento(sock, from, "⚔️ Procurando inimigo", 2, 300);
    const monstro = sortearMonstro(p.nivel);
    const resultado = batalhar(p, monstro);
    p.vida = resultado.vidaFinalJogador;
    let texto = `${monstro.emoji} *${monstro.nome} apareceu!*\n\n` + resultado.log.slice(0, 8).join("\n") + "\n\n";
    if (resultado.venceu) {
      const subiuNivel = ganharXp(p, monstro.xp);
      p.ouro += monstro.ouro;
      texto += `🎉 Vitória! +${monstro.xp} XP, +${monstro.ouro} 🪙`;
      if (subiuNivel) texto += `\n\n⭐ *SUBIU DE NÍVEL! Agora é nível ${p.nivel}!*`;
    } else {
      texto += `💀 Você foi derrotado por ${monstro.nome}... Use !rpgcurar pra se recuperar.`;
    }
    salvar();
    await sock.sendMessage(from, { text: texto });
  },

  async rpgcurar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.rpg) return sock.sendMessage(from, { text: "Você ainda não tem personagem." });
    const p = usuario.rpg;
    const faltando = p.vidaMax - p.vida;
    if (faltando <= 0) return sock.sendMessage(from, { text: "Sua vida já está cheia!" });
    const custo = faltando;
    const curavel = Math.min(faltando, p.ouro);
    p.vida += curavel;
    p.ouro -= curavel;
    p.mana = p.manaMax;
    salvar();
    await sock.sendMessage(from, {
      text: curavel >= faltando
        ? `💚 Curado(a) completamente! Vida: ${p.vida}/${p.vidaMax} (-${curavel} 🪙)`
        : `💛 Curou parcialmente. Vida: ${p.vida}/${p.vidaMax} (-${curavel} 🪙)`,
    });
  },

  async rpgloja({ sock, from }) {
    const texto = "🛒 *LOJA DO AVENTUREIRO*\n\n" + LOJA_RPG.map((item) => `${item.id} — ${item.nome} — ${item.preco} 🪙`).join("\n") + "\n\nCompre com: !rpgcomprar <id>";
    await sock.sendMessage(from, { text: texto });
  },

  async rpgcomprar({ sock, from, args, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    if (!usuario.rpg) return sock.sendMessage(from, { text: "Você ainda não tem personagem." });
    const id = (args[0] || "").toLowerCase();
    const item = LOJA_RPG.find((i) => i.id === id);
    if (!item) return sock.sendMessage(from, { text: "Item não encontrado. Veja !rpgloja." });
    const p = usuario.rpg;
    if (p.ouro < item.preco) return sock.sendMessage(from, { text: `Ouro insuficiente. Você tem ${p.ouro} 🪙, precisa de ${item.preco} 🪙.` });
    p.ouro -= item.preco;
    if (item.cura) { p.vida = p.vidaMax; await sock.sendMessage(from, { text: `🧪 Poção usada! Vida totalmente restaurada.` }); }
    else if (item.curaPet) {
      if (!usuario.pet) return sock.sendMessage(from, { text: "Você não tem pet para alimentar!" });
      usuario.pet.vida = usuario.pet.vidaMax;
      usuario.pet.fome = 0;
      await sock.sendMessage(from, { text: `🦴 Pet alimentado! Vida do pet restaurada.` });
    }
    else {
      if (item.ataque) p.ataque += item.ataque;
      if (item.defesa) p.defesa += item.defesa;
      await sock.sendMessage(from, { text: `✅ Comprou ${item.nome}! Atributos atualizados.` });
    }
    salvar();
  },

  async rpgranking({ sock, from }) {
    const lista = Object.values(db.usuarios).filter((u) => u.rpg).sort((a, b) => b.rpg.nivel - a.rpg.nivel || b.rpg.xp - a.rpg.xp).slice(0, 10);
    if (lista.length === 0) return sock.sendMessage(from, { text: "Ninguém criou personagem ainda. Use !rpgcriar!" });
    const texto = "🏆 *RANKING RPG*\n\n" + lista.map((u, i) => `${i + 1}. ${u.rpg.emoji} ${u.rpg.nome} — nível ${u.rpg.nivel}`).join("\n");
    await sock.sendMessage(from, { text: texto });
  },

  async rpgresetar({ sock, from, senderJid, nomeUsuario }) {
    const usuario = pegarUsuario(senderJid, nomeUsuario);
    usuario.rpg = null;
    salvar();
    await sock.sendMessage(from, { text: "♻️ Personagem apagado. Use !rpgcriar pra criar um novo." });
  },
};

// ============================================================
// REGISTRO DE TODOS OS COMANDOS
// ============================================================

const TODOS_COMANDOS = { ...geral, ...perfil, ...brincadeiras, ...admin, ...dono, ...rpg, ...pets, ...batalhas };

const COMANDOS_SOMENTE_DONO = new Set([
  "ligarbot", "desligarbot", "transmitir", "stats",
  "addmoedas", "removermoedas", "setnivel", "addvip", "removervip",
  "banir", "desbanir", "listagrupos", "listadonos", "manutencao", "versao", "reiniciar",
]);

const COMANDOS_ADMIN_GRUPO = new Set([
  ...Object.keys(admin),
  "autorizargrupo", "desautorizargrupo", "iaativar", "iadesativar", "resetuser",
]);

module.exports = {
  TODOS_COMANDOS,
  COMANDOS_SOMENTE_DONO,
  COMANDOS_ADMIN_GRUPO,
  ehAdminDoGrupo,
  ehDono,
  definirNumeroDonoExibicao,
  entregarRecados,
};
