/**
 * Banco de dados simples baseado em arquivo JSON.
 * Guarda usuários (XP, nível, moedas, mensagens) e grupos (autorização, configs).
 */

const fs = require("fs");
const path = require("path");

const CAMINHO_DB = path.join(__dirname, "..", "data", "db.json");

const PADRAO = {
  botLigado: true, // interruptor geral do bot
  usuarios: {},    // jid -> { xp, nivel, moedas, mensagens, nome }
  grupos: {},      // jid -> { autorizado, boasVindas, iaAtiva }
  cadeiaAprendizado: {}, // palavra -> { próximaPalavra: contagem } — memória da IA local
  vocabulario: {}, // palavra -> quantas vezes já apareceu (estatística da IA)
  manutencao: { ativa: false, mensagem: "🔧 Bot em manutenção, volta já!" },
  iaSemeada: false, // (obsoleto) mantido só por compatibilidade com bancos antigos
  iaSemeadaVersao: 0, // controla até qual versão da base de frases já foi ensinada à IA
  botCasadoCom: null, // jid de quem o bot está "casado", se estiver
};

function carregar() {
  if (!fs.existsSync(CAMINHO_DB)) {
    fs.mkdirSync(path.dirname(CAMINHO_DB), { recursive: true });
    fs.writeFileSync(CAMINHO_DB, JSON.stringify(PADRAO, null, 2));
    return structuredClone(PADRAO);
  }
  try {
    const conteudo = fs.readFileSync(CAMINHO_DB, "utf-8");
    return { ...structuredClone(PADRAO), ...JSON.parse(conteudo) };
  } catch (erro) {
    console.error("Erro ao ler banco de dados, recriando arquivo:", erro);
    fs.writeFileSync(CAMINHO_DB, JSON.stringify(PADRAO, null, 2));
    return structuredClone(PADRAO);
  }
}

let db = carregar();
let salvandoPendente = false;

// Salva com um pequeno atraso agrupado, para não escrever no disco a cada mensagem
function salvar() {
  if (salvandoPendente) return;
  salvandoPendente = true;
  setTimeout(() => {
    fs.writeFileSync(CAMINHO_DB, JSON.stringify(db, null, 2));
    salvandoPendente = false;
  }, 500);
}

function pegarUsuario(jid, nome) {
  if (!db.usuarios[jid]) {
    db.usuarios[jid] = {
      xp: 0,
      nivel: 1,
      moedas: 0,
      mensagens: 0,
      nome: nome || jid,
      titulo: null,
      afk: false,
      afkMotivo: "",
      afkDesde: 0,
      avisos: 0,
      casadoCom: null,
      banido: false,
      rpg: null,
      bio: "",
      corPerfil: null,
      poliRelacao: [],
    };
  }
  if (nome) db.usuarios[jid].nome = nome;
  return db.usuarios[jid];
}

function pegarGrupo(jid) {
  if (!db.grupos[jid]) {
    db.grupos[jid] = {
      autorizado: false,
      boasVindas: true,
      iaAtiva: true,
      mutados: [],
      antilink: false,
      antiNsfw: false,
      antiTravaZap: true,
      regras: "",
    };
  }
  if (!db.grupos[jid].mutados) db.grupos[jid].mutados = [];
  if (db.grupos[jid].antilink === undefined) db.grupos[jid].antilink = false;
  if (db.grupos[jid].antiNsfw === undefined) db.grupos[jid].antiNsfw = false;
  if (db.grupos[jid].antiTravaZap === undefined) db.grupos[jid].antiTravaZap = true;
  if (db.grupos[jid].regras === undefined) db.grupos[jid].regras = "";
  return db.grupos[jid];
}
module.exports = {
  db,
  salvar,
  pegarUsuario,
  pegarGrupo,
};
