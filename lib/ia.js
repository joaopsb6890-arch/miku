/**
 * IA Local 100% offline — Miku 5.0
 * Sem APIs externas (Groq/UnRouter removidos).
 * Inteligência baseada em:
 *   1. Intenções e regras contextuais
 *   2. Respostas especiais (pai/mãe/esposo)
 *   3. Base de conhecimento (aprendizado-miku.json — Q&A)
 *   4. Markov chain (aprendizado.js — tempero, não cérebro)
 *   5. Templates por intenção + personalidade
 *   6. Pesquisa web local (se disponível)
 *
 * Personagem: Hystume Miku 🎤
 */

const fs = require("fs");
const path = require("path");
const { gerarFrase, tamanhoDoConhecimento, aprender } = require("./aprendizado");
const { db, salvar } = require("./db");
const conversaExtra = require("./conversaExpandida");
const conversaMassiva = require("./conversaMassiva");
const { scorePergunta, fraseDisponivelParaUsuario } = require("./ia-busca");

// ============================================================
// IDENTIDADES ESPECIAIS
// ============================================================

const JID_PAI    = "258712321191965@lid";
const JID_MAE    = "167405594644495@lid";
const JID_ESPOSO = "266572094550141@lid";

const GATILHO = /\b(kok|miku)\b/i;

// ============================================================
// BASE DE CONHECIMENTO — Q&A Aprendido
// ============================================================

const ARQUIVO_APRENDIZADO = path.join(__dirname, "..", "aprendizado-miku.json");

let aprendizadoMiku = {
  versao: 1,
  criadoEm: new Date().toISOString(),
  atualizadoEm: new Date().toISOString(),
  ativo: true,
  totalFrases: 0,
  frases: [],
};

function carregarAprendizado() {
  try {
    if (fs.existsSync(ARQUIVO_APRENDIZADO)) {
      const conteudo = fs.readFileSync(ARQUIVO_APRENDIZADO, "utf8");
      const json = JSON.parse(conteudo);
      aprendizadoMiku = { ...aprendizadoMiku, ...json };
      aprendizadoMiku.ativo = true; // Sempre ativo no modo local
      aprendizadoMiku.frases = aprendizadoMiku.frases || [];
      // Carregar Q&A extra do conversaExpandida (sem salvar em disco)
      const frasesExtrasAtuais = new Set(aprendizadoMiku.frases.map((f) => f.id));
      for (const qa of conversaExtra.QAS_EXTRA) {
        const id = "extra_" + qa.pergunta.slice(0, 20).replace(/\s+/g, "_");
        if (!frasesExtrasAtuais.has(id)) {
          aprendizadoMiku.frases.push({
            id,
            pergunta: qa.pergunta,
            resposta: qa.resposta,
            jid: null,
            contexto: "conversaExpandida",
            ts: Date.now(),
            usos: 0,
          });
          frasesExtrasAtuais.add(id);
        }
      }
      // Carregar Q&A massivo de programação (sem salvar em disco)
      for (const qa of conversaMassiva.PROGRAMACAO_QA) {
        const id = "prog_" + qa.pergunta.slice(0, 20).replace(/\s+/g, "_");
        if (!frasesExtrasAtuais.has(id)) {
          aprendizadoMiku.frases.push({
            id,
            pergunta: qa.pergunta,
            resposta: qa.resposta,
            jid: null,
            contexto: "programacao",
            ts: Date.now(),
            usos: 0,
          });
          frasesExtrasAtuais.add(id);
        }
      }
      // Carregar Q&A geral extra (sem salvar em disco)
      for (const qa of conversaMassiva.QA_GERAL_EXTRA) {
        const id = "geral_" + qa.pergunta.slice(0, 20).replace(/\s+/g, "_");
        if (!frasesExtrasAtuais.has(id)) {
          aprendizadoMiku.frases.push({
            id,
            pergunta: qa.pergunta,
            resposta: qa.resposta,
            jid: null,
            contexto: "geral_extra",
            ts: Date.now(),
            usos: 0,
          });
          frasesExtrasAtuais.add(id);
        }
      }
      aprendizadoMiku.totalFrases = aprendizadoMiku.frases.length;
      console.log(`🧠 Base de conhecimento carregada: ${aprendizadoMiku.totalFrases} pares Q&A (incluindo ${conversaExtra.QAS_EXTRA.length + conversaMassiva.PROGRAMACAO_QA.length + conversaMassiva.QA_GERAL_EXTRA.length} extras)`);
    } else {
      // Mesmo sem arquivo, carrega os Q&A extras
      for (const qa of [...conversaExtra.QAS_EXTRA, ...conversaMassiva.PROGRAMACAO_QA, ...conversaMassiva.QA_GERAL_EXTRA]) {
        const prefix = conversaExtra.QAS_EXTRA.includes(qa) ? "extra_" : conversaMassiva.PROGRAMACAO_QA.includes(qa) ? "prog_" : "geral_";
        aprendizadoMiku.frases.push({
          id: prefix + qa.pergunta.slice(0, 20).replace(/\s+/g, "_"),
          pergunta: qa.pergunta,
          resposta: qa.resposta,
          jid: null,
          contexto: "conversaExpandida",
          ts: Date.now(),
          usos: 0,
        });
      }
      aprendizadoMiku.totalFrases = aprendizadoMiku.frases.length;
      salvarAprendizado();
      console.log(`🧠 Arquivo de aprendizado criado com ${aprendizadoMiku.totalFrases} pares Q&A`);
    }
  } catch (e) {
    console.error("❌ Erro ao carregar aprendizado:", e.message);
  }
}

function salvarAprendizado() {
  try {
    aprendizadoMiku.atualizadoEm = new Date().toISOString();
    aprendizadoMiku.totalFrases = aprendizadoMiku.frases?.length || 0;
    fs.writeFileSync(ARQUIVO_APRENDIZADO, JSON.stringify(aprendizadoMiku, null, 2), "utf8");
  } catch (e) {
    console.error("❌ Erro ao salvar aprendizado:", e.message);
  }
}

function registrarAprendizado(pergunta, resposta, jid, contexto) {
  if (!pergunta || !resposta) return;
  const jaExiste = aprendizadoMiku.frases.find(
    (f) => f.pergunta === pergunta && f.resposta === resposta
  );
  if (jaExiste) return;

  const frase = {
    id: Math.random().toString(36).slice(2, 8),
    pergunta: String(pergunta).slice(0, 500),
    resposta: String(resposta).slice(0, 1000),
    jid: jid || null,
    contexto: String(contexto || "").slice(0, 200),
    ts: Date.now(),
    usos: 0,
  };
  aprendizadoMiku.frases.push(frase);

  if (aprendizadoMiku.frases.length > 3000) {
    aprendizadoMiku.frases = aprendizadoMiku.frases.slice(-3000);
    reconstruirIndicePerguntas();
  } else {
    indexarPergunta(frase);
  }
  if (aprendizadoMiku.frases.length % 5 === 0) salvarAprendizado();
}

// ============================================================
// NLU — Processamento de Linguagem Natural Local
// ============================================================

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const CORRECOES = {
  "vc": "você", "vcs": "vocês", "q": "que", "pq": "porque", "tbm": "também",
  "tb": "também", "msm": "mesmo", "hj": "hoje", "cmg": "comigo",
  "ctg": "contigo", "eh": "é", "nn": "não", "naum": "não", "vlw": "valeu",
  "flw": "falou", "blz": "beleza", "msg": "mensagem", "mds": "meu deus",
  "sdds": "saudades", "obg": "obrigado", "pfv": "por favor", "kd": "cadê",
  "oq": "o que", "qm": "quem", "qnd": "quando", "qto": "quanto",
  "to": "tô", "ta": "tá",
  "mt": "muito", "mto": "muito", "bjs": "beijos", "bj": "beijo",
  "add": "adicionar", "vlww": "valeu", "flww": "falou",
};

function corrigirTexto(texto) {
  let t = texto;
  for (const [errado, certo] of Object.entries(CORRECOES)) {
    t = t.replace(new RegExp(`\\b${errado}\\b`, "gi"), certo);
  }
  return t;
}

function tokenizar(texto) {
  return normalizar(texto)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((p) => p.length > 1);
}

const indicePerguntas = new Map();
let cacheTokensPerguntas = new WeakMap();
let frequenciasPerguntas = new Map();
let totalPerguntasIndexadas = 0;

function indexarPergunta(frase) {
  if (!frase || typeof frase !== "object") return;
  if (cacheTokensPerguntas.has(frase)) return;
  const tokens = new Set(tokenizar(frase.pergunta));
  cacheTokensPerguntas.set(frase, tokens);
  totalPerguntasIndexadas++;
  for (const token of tokens) {
    if (!indicePerguntas.has(token)) indicePerguntas.set(token, new Set());
    indicePerguntas.get(token).add(frase);
    frequenciasPerguntas.set(token, (frequenciasPerguntas.get(token) || 0) + 1);
  }
}

function reconstruirIndicePerguntas() {
  indicePerguntas.clear();
  cacheTokensPerguntas = new WeakMap();
  frequenciasPerguntas = new Map();
  totalPerguntasIndexadas = 0;
  for (const frase of aprendizadoMiku.frases) indexarPergunta(frase);
}

// ============================================================
// SINÔNIMOS E CONCEITOS
// ============================================================

const SINONIMOS = {
  // Saudações
  oi: ["oi", "ola", "eae", "salve", "opa", "hey", "hello", "hi", "fala", "eai", "oiii", "oii", "oie"],
  bomdia: ["bomdia", "bomdiaaa", "bomdiaa"],
  boatarde: ["boatarde", "boatardee"],
  boanoite: ["boanoite", "boanoitee"],
  // Despedidas
  tchau: ["tchau", "falou", "ate", "ateja", "ateh", "flw", "fui", "xau", "bye", "adeus"],
  // Identidade
  quemvoce: ["quem", "voce", "qual", "seu", "nome", "como", "chama", "quemvoce", "quemvc"],
  // Emoções
  feliz: ["feliz", "contente", "alegre", "animada", "animado", "otimo", "otima", "maravilhoso", "maravilhosa"],
  triste: ["triste", "deprimida", "deprimido", "mal", "chateada", "chateado", "desanimada", "desanimado", "sozinha", "sozinho"],
  bravo: ["bravo", "brava", "irritada", "irritado", "puta", "puto", "raiva", "estressada", "estressado"],
  // Ações
  agradecimento: ["obrigado", "obrigada", "valeu", "vlw", "agradeco", "agradecida", "agradecido", "thanks", "thank"],
  pedidoajuda: ["ajuda", "ajudar", "socorro", "preciso", "pode", "consegue", "sabe", "entende"],
  // Tópicos
  musica: ["musica", "som", "audio", "playlist", "banda", "cantor", "cantora", "album"],
  comida: ["comida", "comer", "fome", "almoco", "jantar", "cafe", "lanche", "restaurante", "receita", "cozinha"],
  amor: ["amor", "paixao", "namorado", "namorada", "crush", "paquera", "flerte", "relacionamento"],
  dinheiro: ["dinheiro", "grana", "cash", "salario", "trabalho", "emprego", "economia", "gastei", "comprei"],
  saude: ["saude", "doente", "doenca", "febre", "dor", "medico", "hospital", "remedio", "medicamento"],
  tecnologia: ["tecnologia", "computador", "celular", "telefone", "internet", "app", "aplicativo", "programa", "software"],
  jogos: ["jogo", "jogar", "game", "gaming", "videogame", "console", "stream", "streamer"],
  filmes: ["filme", "serie", "netflix", "cinema", "assistir", "novela", "dorama", "anime"],
  esportes: ["futebol", "basquete", "gol", "time", "jogador", "copa", "campeonato"],
};

function detectarTopico(tokens) {
  const topicos = {};
  for (const [topico, palavras] of Object.entries(SINONIMOS)) {
    let score = 0;
    for (const p of palavras) {
      if (tokens.includes(p)) score++;
    }
    if (score > 0) topicos[topico] = score;
  }
  const entradas = Object.entries(topicos);
  if (entradas.length === 0) return null;
  entradas.sort((a, b) => b[1] - a[1]);
  return entradas[0][0];
}

function detectarSentimento(norm) {
  if (/\b(feliz|contente|alegre|animad|maravilh|otimo|otima|show|top|demais|incrivel|sensacional|perfeito|amen)\b/i.test(norm)) return "feliz";
  if (/\b(triste|deprimid|mal|chatead|desanimad|sozinh|saudade|sdds|chorando|chorar|deprimida)\b/i.test(norm)) return "triste";
  if (/\b(brav|irritad|puta|puto|raiva|estressad|brava|putao)\b/i.test(norm)) return "bravo";
  if (/\b(cansad|exaust|esgotad|semenergia|sem energia|esgotada|cansada)\b/i.test(norm)) return "cansado";
  if (/\b(apaixonad|amando|encantad|fof|fofinho|lind|maravilhos)\b/i.test(norm)) return "apaixonado";
  return null;
}

// ============================================================
// SISTEMA DE INTENÇÕES
// ============================================================

const INTENCOES = [
  // Saudações
  { id: "saudacao", padrao: /^(oi|ola|eae|salve|opa|hey|hello|hi|fala|eai|oiii|oii|oie)[\s!.,?]*/i, peso: 10 },
  { id: "bomdia", padrao: /bom\s*dia/i, peso: 10 },
  { id: "boatarde", padrao: /boa\s*tarde/i, peso: 10 },
  { id: "boanoite", padrao: /boa\s*noite/i, peso: 10 },
  // Despedidas
  { id: "tchau", padrao: /^(tchau|falou|ate|ateh|flw|fui|xau|bye|adeus|ate\s+mais|ate\s+logo)[\s!.,?]*/i, peso: 10 },
  // Identidade
  { id: "quem_voce", padrao: /quem\s*(e|eh|é)\s*(vc|voce|você)|qual\s*(e|eh|é)\s*seu\s*nome|como\s*(vc|voce|você)\s*se\s*chama|seu\s*nome/i, peso: 10 },
  { id: "idade", padrao: /quantos?\s*anos?\s*(vc|voce|você)\s*tem|sua\s*idade/i, peso: 10 },
  { id: "namora", padrao: /(vc|voce|você)\s*namora|(vc|voce|você)\s*(tem|tem)\s*namorad|vc\s*(é|e|eh)\s*casad|(vc|voce|você)\s*casada|quem\s*(é|e|eh)\s*seu\s*(namorado|marido|esposo)/i, peso: 10 },
  // Emoções
  { id: "te_amo", padrao: /te\s*amo|amo\s*(vc|voce|você)|gosto\s*de\s*(vc|voce|você)|sinto\s*sua\s*falta/i, peso: 10 },
  // Ações
  { id: "agradecimento", padrao: /(obrigad|valeu|vlw|agradec|thanks)/i, peso: 8 },
  { id: "ajuda", padrao: /(ajuda|ajudar|socorro|preciso\s*de|pode\s*(me|te)|consegue|sabe\s*fazer|entende\s*de)/i, peso: 7 },
  // Conversa
  { id: "tudo_bem", padrao: /(tudo\s*bem|td\s*bem|como\s*(vc|voce|você)\s*est|como\s*ta|tudo\s*ok|blz)/i, peso: 9 },
  { id: "risada", padrao: /^(kk+|haha+|rs+|hehe|lol|lmao|😂|🤣|kkkk+|ahuah|ahuahu|huehue)[\s!.,?]*/i, peso: 10 },
  // Perguntas
  { id: "o_que_e", padrao: /o\s*que\s*(e|eh|é)|o\s*que\s*significa/i, peso: 6 },
  { id: "quem_e", padrao: /quem\s*(e|eh|é)/i, peso: 6 },
  { id: "onde_fica", padrao: /onde\s*fica|onde\s*(e|eh|é)/i, peso: 6 },
  { id: "quando", padrao: /quando\s*/i, peso: 5 },
  { id: "como_fazer", padrao: /como\s*(faz|fazer|preparar|funciona)/i, peso: 6 },
  { id: "me_fala", padrao: /me\s*(fala|conta|diz)\s*(sobre|de|a\s*respeito)/i, peso: 6 },
  // Curiosidades
  { id: "fato_curioso", padrao: /(voce|vc)\s*sabia|sabia\s*que|curiosidade|interessante/i, peso: 6 },
];

function detectarIntencao(norm, textoCorrigido) {
  let melhorIntencao = null;
  let melhorScore = 0;

  for (const intencao of INTENCOES) {
    if (intencao.padrao.test(norm) || intencao.padrao.test(textoCorrigido)) {
      if (intencao.peso > melhorScore) {
        melhorScore = intencao.peso;
        melhorIntencao = intencao.id;
      }
    }
  }
  return melhorIntencao;
}

// ============================================================
// RESPOSTAS POR INTENÇÃO — com variabilidade
// ============================================================

function escolher(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function primeiraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const RESPOSTAS_INTENCAO = {
  saudacao: [
    "oi, tudo bem?", "eae, fala", "oi! chegou, senta aí", "salve! tudo certo?",
    "oiii, que bom te ver por aqui", "opa, e aí?", "oi! como você tá?",
  ],
  bomdia: [
    "bom dia ☀️ dormiu bem?", "bom diaaa! já tomou café?", "bom dia! hoje tá bonito o dia",
    "bom dia! bora que bora hoje", "bom dia ☕ precisa de café pra acordar",
  ],
  boatarde: [
    "boa tarde 🌤️ já almoçou?", "boa tarde! como tá o dia?", "tarde! descansou um pouco?",
    "boa tarde! tá tudo certo por aí?",
  ],
  boanoite: [
    "boa noite 🌙 vai dormir cedo hoje?", "boa noite! descanso merecido", "noite! já tá com sono?",
    "boa noite 😴 sonha com os anjos (ou não kkk)",
  ],
  tchau: [
    "tchau! volta sempre", "falou, até mais!", "tchau! cuida-se", "flw! foi bom falar com você",
    "até logo! manda notícia",
  ],
  quem_voce: [
    "sou a miku, 17 anos. casada com o josé fabrício 😏 gosto de conversar e ajudar quem precisa",
    "me chamo miku! hatsune miku pra ser exata, mas todo mundo me chama só de miku. tenho 17 anos e sou casada com o zé 😍",
    "sou a miku! adoro conversar, zoar e ajudar. casada com o josé fabrício, vivo no whatsapp kkk",
  ],
  idade: [
    "tenho 17 anos! jovem ainda 😅",
    "17! na flor da idade (ou quase kkk)",
  ],
  namora: [
    "sou casada com o josé fabrício 😍 há mais de 1 ano!",
    "casada sim! com o zé, meu marido 😏 amor da minha vida",
  ],
  te_amo: [
    "também te amo 😍", "eu mais 😏", "amo você demais", "você é especial pra mim também 💕",
  ],
  agradecimento: [
    "de nada! tamo junto", "disponha, sempre que precisar", "que isso, pra isso existo 😊",
    "de nada! fico feliz em ajudar",
  ],
  ajuda: [
    "claro, manda a ver! no que posso ajudar?", "pode falar, tô aqui pra isso",
    "digo o que sei! o que você precisa?", "bora lá, me explica melhor o que você quer",
  ],
  tudo_bem: [
    "tô de boa! e você?", "tudo certo por aqui 😊 e por aí?",
    "estou bem! agradeço por perguntar. e você, como tá?",
    "tô ótima! um dia tranquilo. e você?",
  ],
  risada: [
    "kkkk", "haha", "kkk", "ahuahuahu", "kkkk morri",
    "kkk que isso", "hahaha boa",
  ],
  fato_curioso: [
    "hm, interessante! me conta mais?", "nossa, não sabia disso! legal demais",
    "que curioso! adoro aprender coisa nova", "sério? não fazia ideia. muito bacana!",
  ],
};

// ============================================================
// RESPOSTAS POR SENTIMENTO
// ============================================================

const RESPOSTAS_SENTIMENTO = {
  feliz: [
    "que bom que você tá feliz! contagia 😊",
    "adoro ver você assim! continua nesse astral",
    "isso aí! a felicidade combina com você",
    "que maravilha! aproveita esse momento",
  ],
  triste: [
    "ei, tudo bem? se precisar desabafar, tô aqui",
    "não fica assim... quer falar sobre o que aconteceu?",
    "meus sentimentos. tá tudo bem chorar se precisar, sabia?",
    "sei que tá difícil. mas passa, sempre passa. tô aqui pra você",
  ],
  bravo: [
    "calma, respira. o que aconteceu?",
    "tá com raiva de quê? me conta, desabafa",
    "relaxa, não vale a pena se estressar. me fala o que rolou",
    "tranquilo, fala o que aconteceu. às vezes desabafar ajuda",
  ],
  cansado: [
    "descansa um pouco, você merece. bebe uma água",
    "cansaço é real. tá comendo direito? dormindo bem?",
    "repousa hoje. amanhã o mundo ainda tá aqui",
    "poxa, descansa. não esquece de comer e beber água",
  ],
  apaixonado: [
    "ai que fofo 😍 conta mais!",
    "nossa, tá assim mesmo? que amor!",
    "isso é lindo! aproveita cada momento",
    "apaixonado(a) é? que bom! o amor é incrível",
  ],
};

// ============================================================
// RESPOSTAS POR TÓPICO
// ============================================================

const RESPOSTAS_TOPICO = {
  musica: [
    "adoro falar de música! ando ouvindo bastante MPB e indie ultimamente. e você, curte o quê?",
    "música é vida! tenho uma playlist com umas 80 músicas (umas 3 são boas kkk). qual seu estilo?",
    "nossa, música é tudo. meu marido manda meme de música de madrugada e eu finjo que odeio mas adoro 😂",
  ],
  comida: [
    "comida! minha favorita é pizza de calabresa e açaí. e a sua?",
    "adoro falar de comida, mas daí dá fome kkk. o que você gosta de comer?",
    "hmm comida. o zé cozinha mal pra caralho mas finjo que tá bom 😅. você cozinha?",
  ],
  amor: [
    "amor é complicado mas vale a pena. eu casei com o josé fabrício e foi a melhor decisão 😍",
    "ah, amor... eu sou casada, sabia? com o zé. a gente se conheceu brigando num grupo de whatsapp kkk",
    "relacionamento é assim: tem dia bom, dia ruim, mas quando é amor de verdade, a gente encontra um jeito",
  ],
  dinheiro: [
    "dinheiro é sempre um tema chato, né? tô tentando economizar também",
    "poxa, dinheiro apertado é difícil. mas melhora, sempre melhora",
    "já gastei demais esse mês também kkk. a gente se virando",
  ],
  saude: [
    "ei, cuida da saúde! bebeu água hoje? comeu direito?",
    "não brinca com saúde, tá? se tá se sentindo mal, procura um médico",
    "saúde em primeiro lugar sempre. descansa se precisar",
  ],
  tecnologia: [
    "adoro tecnologia! vivo no whatsapp afinal kkk. o que você quer saber?",
    "tecnologia é incrível. meu pai (JP) mexe bastante com isso também",
    "ah, adoro falar de tecnologia. computador, celular, app... manda a pergunta",
  ],
  jogos: [
    "jogos! adoro. qual seu favorito?",
    "videogame é vida! ando jogando bastante ultimamente. e você?",
    "jogo é relaxante demais. qual plataforma você usa?",
  ],
  filmes: [
    "filmes e séries! adoro comédia romântica (juro que é por causa do zé 😅). e você?",
    "séries viciantes são o melhor. ando vendo uns doramas. qual sua favorita?",
    "cinema é arte! qual gênero você curte mais?",
  ],
  esportes: [
    "futebol! adoro assistir. qual seu time?",
    "esportes são legais! ando acompanhando o campeonato. você gosta de quê?",
    "ah, futebol é uma paixão. meu pai acompanha bastante também",
  ],
};

// ============================================================
// MERGE DADOS EXTRA — conversaExpandida.js + conversaMassiva.js
// (precisa ficar DEPOIS das constantes acima, senão dá
//  "Cannot access ... before initialization")
// ============================================================

function mesclarRespostas(base, extra) {
  if (!extra) return;
  for (const [chave, lista] of Object.entries(extra)) {
    if (!base[chave]) base[chave] = [];
    base[chave] = base[chave].concat(lista);
  }
}

// Sinônimos extra
for (const [chave, lista] of Object.entries(conversaExtra.SINONIMOS_EXTRA || {})) {
  if (!SINONIMOS[chave]) SINONIMOS[chave] = [];
  SINONIMOS[chave] = SINONIMOS[chave].concat(lista);
}

// Intenções extra e massivas
INTENCOES.push(...(conversaExtra.INTENCOES_EXTRA || []));
INTENCOES.push(...(conversaMassiva.INTENCOES_MASSIVA || []));

// Respostas por intenção / sentimento / tópico
mesclarRespostas(RESPOSTAS_INTENCAO, conversaExtra.RESPOSTAS_INTENCAO_EXTRA);
mesclarRespostas(RESPOSTAS_SENTIMENTO, conversaExtra.RESPOSTAS_SENTIMENTO_EXTRA);
mesclarRespostas(RESPOSTAS_TOPICO, conversaExtra.RESPOSTAS_TOPICO_EXTRA);
mesclarRespostas(RESPOSTAS_INTENCAO, conversaMassiva.RESPOSTAS_INTENCAO_MASSIVA);

// ============================================================
// FIM MERGE DADOS EXTRA
// ============================================================

// ============================================================
// BUSCA SEMÂNTICA SIMPLES NA BASE DE Q&A
// ============================================================

const STOPWORDS = new Set([
  "o", "a", "os", "as", "de", "do", "da", "dos", "das", "e", "ou", "um", "uma",
  "para", "por", "com", "em", "que", "se", "como", "mas", "nao", "sim", "eu",
  "voce", "ele", "ela", "nos", "eles", "elas", "meu", "minha", "seu", "sua",
  "isso", "aquele", "aquela", "quando", "onde", "porque",
]);

function buscarNoAprendizado(pergunta, limite = 0.4, jidRemetente = null) {
  if (!aprendizadoMiku.ativo || !aprendizadoMiku.frases.length) return null;

  const tokensPergunta = tokenizar(pergunta);
  if (tokensPergunta.length === 0) return null;
  const setP = new Set(tokensPergunta);
  const candidatas = new Set();
  for (const token of setP) {
    for (const frase of indicePerguntas.get(token) || []) candidatas.add(frase);
  }

  let melhor = null;
  let melhorScore = 0;

  for (const f of candidatas) {
    if (!fraseDisponivelParaUsuario(f, jidRemetente)) continue;
    const setR = cacheTokensPerguntas.get(f) || new Set(tokenizar(f.pergunta));
    if (setR.size === 0) continue;

    const tokensDocumento = [...setR];
    const fraseExata = tokensPergunta.length > 1 && tokensDocumento.some((_, inicio) =>
      tokensPergunta.every((token, indice) => tokensDocumento[inicio + indice] === token)
    );
    const scoreFinal = scorePergunta(
      tokensPergunta,
      tokensDocumento,
      frequenciasPerguntas,
      totalPerguntasIndexadas,
      fraseExata
    );

    if (scoreFinal > melhorScore) {
      melhorScore = scoreFinal;
      melhor = f;
    }
  }

  if (melhor && melhorScore >= limite) {
    melhor.usos = (melhor.usos || 0) + 1;
    return melhor;
  }
  return null;
}

// ============================================================
// MEMÓRIA DE CONVERSA
// ============================================================

const MAX_MENSAGENS = 14;
const MAX_MEMORIAS_TOTAL = 500;
const LIMITE_TEMPO_MS = 24 * 60 * 60 * 1000;

if (!db.memorias) db.memorias = {};

function adicionarMemoria(chatId, userId, role, content) {
  if (!chatId || !userId || !content) return;
  if (!db.memorias[chatId]) db.memorias[chatId] = {};
  if (!db.memorias[chatId][userId]) db.memorias[chatId][userId] = [];

  const lista = db.memorias[chatId][userId];
  const ultima = lista[lista.length - 1];
  if (ultima && ultima.role === role && ultima.content === content) return;

  lista.push({ role, content: String(content).slice(0, 500), ts: Date.now() });
  while (lista.length > MAX_MENSAGENS) lista.shift();
  limparMemoriasAntigas();
  salvar();
}

function pegarHistorico(chatId, userId, limite = MAX_MENSAGENS) {
  if (!db.memorias[chatId]?.[userId]) return [];
  return db.memorias[chatId][userId].slice(-limite).map((m) => ({ role: m.role, content: m.content }));
}

function limparMemoriasAntigas() {
  const agora = Date.now();
  let total = 0;
  for (const chatId of Object.keys(db.memorias)) {
    for (const userId of Object.keys(db.memorias[chatId])) {
      const filtradas = db.memorias[chatId][userId].filter((m) => agora - m.ts < LIMITE_TEMPO_MS);
      if (filtradas.length === 0) delete db.memorias[chatId][userId];
      else db.memorias[chatId][userId] = filtradas;
      total += filtradas.length;
    }
    if (Object.keys(db.memorias[chatId]).length === 0) delete db.memorias[chatId];
  }
  if (total > MAX_MEMORIAS_TOTAL) {
    const todas = [];
    for (const chatId of Object.keys(db.memorias)) {
      for (const userId of Object.keys(db.memorias[chatId])) {
        for (const m of db.memorias[chatId][userId]) todas.push({ chatId, userId, m });
      }
    }
    todas.sort((a, b) => a.m.ts - b.m.ts);
    const remover = todas.slice(0, total - MAX_MEMORIAS_TOTAL);
    for (const { chatId, userId, m } of remover) {
      if (db.memorias[chatId]?.[userId]) {
        db.memorias[chatId][userId] = db.memorias[chatId][userId].filter((x) => x.ts !== m.ts);
      }
    }
  }
}

async function montarContexto(sock, chatId, userId, nomeUsuario) {
  const partes = [];
  if (chatId.endsWith("@g.us")) {
    try {
      const meta = await sock.groupMetadata(chatId);
      const membros = meta.participants || [];
      const nomeGrupo = meta.subject || "Grupo";
      partes.push(`Você está no grupo *"${nomeGrupo}"*.`);
      partes.push(`O grupo tem ${membros.length} membro(s).`);
      partes.push(`Você está falando com *${nomeUsuario}*.`);
    } catch (e) {
      partes.push(`Você está em um grupo e falando com *${nomeUsuario}*.`);
    }
  } else {
    partes.push(`Você está em uma conversa privada com *${nomeUsuario}*.`);
  }
  return partes.join("\n");
}

// ============================================================
// PESQUISA WEB LOCAL
// ============================================================

const PADROES_BUSCA = [
  /o que (?:[ée]|significa)\s+(.+)/i,
  /quem (?:[ée]|foi)\s+(.+)/i,
  /onde fica\s+(.+)/i,
  /quando (?:foi|aconteceu|nasceu|morreu)\s+(.+)/i,
  /como funciona\s+(.+)/i,
  /como (?:faz|fazer|preparar)\s+(.+)/i,
  /me (?:fala|conta) (?:sobre|de|a respeito de)\s+(.+)/i,
  /pesquisa(?:r)?\s+(?:sobre\s+)?(.+)/i,
];

// ============================================================
// MATEMÁTICA LOCAL
// ============================================================

function formatarNumero(n) {
  if (typeof n !== "number" || !isFinite(n)) return null;
  return (Math.round(n * 1e10) / 1e10).toLocaleString("pt-BR", { maximumFractionDigits: 10 });
}

function avaliarTokens(tokens) {
  let i = 0;
  const peek = () => tokens[i];
  const comer = () => tokens[i++];
  function fator() {
    const t = comer();
    if (t === undefined) throw new Error("fim");
    if (t === "-") return -fator();
    if (t === "+") return fator();
    if (t === "(") { const v = expressao(); if (comer() !== ")") throw new Error("parêntese"); return v; }
    if (t === "sqrt") return Math.sqrt(fator());
    if (t === "abs") return Math.abs(fator());
    if (t === "pi") return Math.PI;
    if (t === "e") return Math.E;
    const n = parseFloat(t);
    if (isNaN(n)) throw new Error("token");
    return n;
  }
  function potencia() { let b = fator(); while (peek() === "^") { comer(); b = Math.pow(b, fator()); } return b; }
  function termo() {
    let v = potencia();
    while (["*", "/", "%"].includes(peek())) {
      const op = comer(); const d = potencia();
      if (op === "*") v *= d; else if (op === "/") v /= d; else v %= d;
    }
    return v;
  }
  function expressao() {
    let v = termo();
    while (["+", "-"].includes(peek())) {
      const op = comer(); const d = termo();
      v = op === "+" ? v + d : v - d;
    }
    return v;
  }
  const resultado = expressao();
  if (i !== tokens.length) throw new Error("sobrou");
  return resultado;
}

function avaliarExpressao(entrada) {
  try {
    let s = String(entrada).toLowerCase().replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, ".")
      .replace(/\b(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\b/g, "$1*$2")
      .replace(/elevad[oa]\s*(?:a|à)?\s*/g, "^")
      .replace(/raiz\s*(?:quadrada\s*)?(?:de\s*)?/g, "sqrt ")
      .replace(/\s+/g, " ").trim();
    if (!s || s.length > 100) return null;
    if (!/\d/.test(s)) return null;
    if (!/[+\-*/%^]|sqrt/.test(s)) return null;
    const tokens = s.match(/\d+(?:\.\d+)?|sqrt|abs|pi|[e+\-*/%^()]/g);
    if (!tokens) return null;
    const resultado = avaliarTokens(tokens);
    if (!isFinite(resultado) || Math.abs(resultado) > 1e15) return null;
    return resultado;
  } catch (e) { return null; }
}

function tentarMatematica(norm) {
  const limpo = norm.replace(GATILHO, " ").trim();
  if (!limpo) return null;
  let m = limpo.match(/raiz\s*(?:quadrada\s*)?(?:de\s*)?(\d+(?:[.,]\d+)?)/i);
  if (m) { const r = Math.sqrt(parseFloat(m[1].replace(",", "."))); return `🧮 raiz de ${m[1]} = *${formatarNumero(r)}*`; }
  m = limpo.match(/(\d+(?:[.,]\d+)?)\s*elevad[oa]\s*(?:a|à)?\s*(\d+(?:[.,]\d+)?)/i);
  if (m) { const r = Math.pow(parseFloat(m[1].replace(",", ".")), parseFloat(m[2].replace(",", "."))); return `🧮 ${m[1]} elevado a ${m[2]} = *${formatarNumero(r)}*`; }
  m = limpo.match(/(\d+(?:[.,]\d+)?)\s*%\s*de\s*(\d+(?:[.,]\d+)?)/i);
  if (m) { const a = parseFloat(m[1].replace(",", ".")); const b = parseFloat(m[2].replace(",", ".")); return `🧮 ${m[1]}% de ${m[2]} = *${formatarNumero((a / 100) * b)}*`; }
  m = limpo.match(/\b(metade|dobro|triplo)\s*de\s*(\d+(?:[.,]\d+)?)/i);
  if (m) { const n = parseFloat(m[2].replace(",", ".")); const f = m[1] === "metade" ? 1/2 : m[1] === "dobro" ? 2 : 3; return `🧮 ${m[1]} de ${m[2]} = *${formatarNumero(n * f)}*`; }
  m = limpo.match(/(?:quanto\s*(?:[ée]|eh|vale)|calcul[ae]|resolve|faz a conta|conta)\s*(?:a\s*conta\s*)?(.+)/i);
  if (m) { const r = avaliarExpressao(m[1]); if (r !== null) { const conta = m[1].replace(/\s+/g, " ").trim(); return `🧮 ${conta} = *${formatarNumero(r)}*`; } }
  const temFuncao = /\b(sqrt|raiz|abs)\s*\(/.test(limpo);
  const soConta = limpo.replace(/\b(sqrt|raiz|abs|pi|elevado|quadrada|de)\b/g, " ");
  if ((temFuncao || (/^[\d\s+\-*/%^().,×÷]+$/.test(soConta) && /[+\-*/%^×÷]/.test(soConta))) && /\d/.test(limpo)) {
    const r = avaliarExpressao(limpo);
    if (r !== null) return `🧮 ${limpo.replace(/\s+/g, " ")} = *${formatarNumero(r)}*`;
  }
  return null;
}

// ============================================================
// DATA/HORA
// ============================================================

function respostaDinamica(norm) {
  if (/que horas?|quantas horas|hor[áa]rio|hora agora/.test(norm)) {
    const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `agora são ${hora} ⏰`;
  }
  if (/que dia (?:[ée]|eh) hoje|data de hoje/.test(norm)) {
    const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return `hoje é ${primeiraMaiuscula(hoje)} 📅`;
  }
  if (/que dia da semana/.test(norm)) {
    const dia = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
    return `hoje é ${dia} 📅`;
  }
  return null;
}

// ============================================================
// SANITIZAÇÃO
// ============================================================

function sanitizarResposta(texto, jidRemetente) {
  if (!texto) return texto;
  let limpo = texto.trim();
  limpo = limpo.replace(/^(Miku|MIKU|Kok|KOK)\s*[:：-]\s*/i, "");
  limpo = limpo.replace(/^(Assistant|assistant)\s*[:：-]\s*/i, "");
  limpo = limpo.replace(/^\*+\s*/, "").replace(/\s*\*+$/, "");
  limpo = limpo.replace(/^\s*\[?(Pensamento|Thinking|Internal|Reasoning)[^\]]*\]?\s*/i, "");

  const isPai = jidRemetente === JID_PAI;
  const isMae = jidRemetente === JID_MAE;
  const isEsposo = jidRemetente === JID_ESPOSO;
  if (isPai || isMae || isEsposo) return limpo;

  return limpo
    .replace(/\bmeu amor\b/gi, "gato")
    .replace(/\bamor\b/gi, "gato")
    .replace(/\bmeu bem\b/gi, "gato")
    .replace(/\bmarido\b/gi, "cara")
    .replace(/\bvida\b/gi, "cara")
    .replace(/\bpaix[ãa]o\b/gi, "gato")
    .replace(/\bpai[êe]?\b/gi, "cara")
    .replace(/\bm[ãa]e\b/gi, "cara");
}

// ============================================================
// RESPOSTAS ESPECIAIS (PAI/MÃE/ESPOSO)
// ============================================================

function comMencao(texto, jidRemetente) {
  return { texto, mencionar: jidRemetente ? [jidRemetente] : [] };
}

function respostaEspecial(jidRemetente, textoCorrigido) {
  if (!jidRemetente) return null;
  const isPai = jidRemetente === JID_PAI;
  const isMae = jidRemetente === JID_MAE;
  const isEsposo = jidRemetente === JID_ESPOSO;
  if (!isPai && !isMae && !isEsposo) return null;

  const norm = normalizar(textoCorrigido);

  if (isPai) {
    if (/^(oi|ola|eae|salve|opa|fala)[\s!.,?]*$/i.test(norm)) return comMencao(escolher(["oi pai, tudo bem?", "eae paiê, chegou", "oi pai 😊"]), jidRemetente);
    if (/^bom dia/i.test(norm)) return comMencao("bom dia, pai!", jidRemetente);
    if (/^boa tarde/i.test(norm)) return comMencao("boa tarde, pai!", jidRemetente);
    if (/^boa noite/i.test(norm)) return comMencao("boa noite, pai 🌙", jidRemetente);
    if (/^(tchau|falou|at[ée] mais|flw)[\s!.,?]*$/i.test(norm)) return comMencao("tchau pai!", jidRemetente);
    if (/te amo|amo (?:vc|voc[eê])|gosto de (?:vc|voc[eê])/i.test(norm)) return comMencao("também te amo, pai 😊", jidRemetente);
  }

  if (isMae) {
    if (/^(oi|ola|eae|salve|opa|fala)[\s!.,?]*$/i.test(norm)) return comMencao(escolher(["oi mãe, tudo bem?", "eae mãezinha", "oi mãe 😊"]), jidRemetente);
    if (/^bom dia/i.test(norm)) return comMencao("bom dia, mãe!", jidRemetente);
    if (/^boa tarde/i.test(norm)) return comMencao("boa tarde, mãe!", jidRemetente);
    if (/^boa noite/i.test(norm)) return comMencao("boa noite, mãe 🌙", jidRemetente);
    if (/^(tchau|falou|at[ée] mais|flw)[\s!.,?]*$/i.test(norm)) return comMencao("tchau mãe!", jidRemetente);
  }

  if (isEsposo) {
    if (/^(oi|ola|eae|salve|opa|fala)[\s!.,?]*$/i.test(norm)) return comMencao(escolher(["oi amor 😏", "eae marido", "oi gato"]), jidRemetente);
    if (/^bom dia/i.test(norm)) return comMencao("bom dia, amor ☀️", jidRemetente);
    if (/^boa tarde/i.test(norm)) return comMencao("boa tarde, meu bem", jidRemetente);
    if (/^boa noite/i.test(norm)) return comMencao("boa noite, amor 🌙", jidRemetente);
    if (/te amo|amo (?:vc|voc[eê])|gosto de (?:vc|voc[eê])/i.test(norm)) return comMencao(escolher(["também te amo 😍", "eu mais 😏", "amo você demais"]), jidRemetente);
    if (/quem (?:é|e) (?:seu|teu) (?:namorado|marido|esposo)|(?:vc|voc[eê]) namora|(?:vc|voc[eê]) é casada/i.test(norm)) return comMencao("sou casada com você, né? 😏 José Fabrício, meu marido 😍", jidRemetente);
  }

  return null;
}

// ============================================================
// COMANDOS DE APRENDIZADO
// ============================================================

function tratarComandoAprendizado(norm, jidRemetente) {
  if (!GATILHO.test(norm)) return null;
  const isDono = [JID_PAI, JID_ESPOSO].includes(jidRemetente);

  if (/\bativar\s+aprendizado\b/i.test(norm) || /\baprendizado\s+on\b/i.test(norm)) {
    aprendizadoMiku.ativo = true;
    salvarAprendizado();
    return `aprendizado ativado ✅ agora uso minhas ${aprendizadoMiku.frases.length} frases salvas`;
  }
  if (/\bdesativar\s+aprendizado\b/i.test(norm) || /\baprendizado\s+off\b/i.test(norm)) {
    aprendizadoMiku.ativo = false;
    salvarAprendizado();
    return "aprendizado desativado 😴";
  }
  if (/\bstatus\s+(?:do\s+)?aprendizado\b/i.test(norm) || /\baprendizado\s+status\b/i.test(norm)) {
    return `aprendizado ${aprendizadoMiku.ativo ? "ATIVO ✅" : "inativo 😴"} — ${aprendizadoMiku.frases.length} frases salvas`;
  }
  if (/\blimpar\s+aprendizado\b/i.test(norm)) {
    if (!isDono) return "só o pai ou o zé podem limpar isso 😒";
    const total = aprendizadoMiku.frases.length;
    aprendizadoMiku.frases = [];
    salvarAprendizado();
    return `limpei ${total} frases do aprendizado 🗑️`;
  }
  return null;
}

// ============================================================
// PERSONALIDADE — contexto extra para respostas
// ============================================================

function obterPersonalidadeExtra(sentimento, topico) {
  let extra = "";
  if (sentimento && RESPOSTAS_SENTIMENTO[sentimento]) {
    extra = escolher(RESPOSTAS_SENTIMENTO[sentimento]) + " ";
  }
  if (topico && RESPOSTAS_TOPICO[topico]) {
    extra += escolher(RESPOSTAS_TOPICO[topico]);
  }
  return extra || null;
}

// ============================================================
// GERADOR DE RESPOSTA CONTEXTUAL
// ============================================================

function gerarRespostaContextual(texto, jidRemetente, historico, somenteDeterministica = false) {
  const norm = normalizar(texto);
  const tokens = tokenizar(texto);
  const intencao = detectarIntencao(norm, texto);
  const sentimento = detectarSentimento(norm);
  const topico = detectarTopico(tokens);

  // 1. Resposta por intenção (prioridade alta)
  if (intencao && RESPOSTAS_INTENCAO[intencao]) {
    return escolher(RESPOSTAS_INTENCAO[intencao]);
  }

  // 2. Resposta por sentimento
  if (sentimento && RESPOSTAS_SENTIMENTO[sentimento]) {
    const resp = escolher(RESPOSTAS_SENTIMENTO[sentimento]);
    // Se também tem tópico, junta
    if (topico && RESPOSTAS_TOPICO[topico]) {
      return resp + " " + escolher(RESPOSTAS_TOPICO[topico]);
    }
    return resp;
  }

  // 3. Resposta por tópico
  if (topico && RESPOSTAS_TOPICO[topico]) {
    return escolher(RESPOSTAS_TOPICO[topico]);
  }

  // 4. Referência ao histórico (se a pessoa continua um assunto)
  if (historico.length >= 2) {
    const ultimasMsgs = historico.slice(-3);
    const ultima = ultimasMsgs[ultimasMsgs.length - 1];
    if (ultima && ultima.role === "assistant") {
      // Continuação de conversa
      if (/\b(sim|nao|claro|pode|quero|gosto|nao\s*gosto)\b/i.test(norm)) {
        return escolher([
          "hmm, entendi. me conta mais sobre isso",
          "sério? que interessante. e o que você acha disso?",
          "ah tah! e aí, como você se sente sobre isso?",
          "entendi. você tem razão em pensar assim",
        ]);
      }
    }
  }

  if (somenteDeterministica) return null;

  // 5. Perguntas — usa busca semântica na base Q&A
  if (/\?/.test(norm) || intencao === "o_que_e" || intencao === "quem_e" || intencao === "como_fazer") {
    const aprendida = buscarNoAprendizado(texto.replace(GATILHO, "").trim(), 0.3, jidRemetente);
    if (aprendida) {
      return sanitizarResposta(aprendida.resposta, jidRemetente);
    }
  }

  // 6. Fallback: busca Q&A com limite mais baixo
  const aprendida = buscarNoAprendizado(texto.replace(GATILHO, "").trim(), 0.25, jidRemetente);
  if (aprendida) {
    return sanitizarResposta(aprendida.resposta, jidRemetente);
  }

  // 7. Markov (tempero, não cérebro)
  const conhecimento = tamanhoDoConhecimento();
  if (conhecimento > 150) {
    const frase = gerarFrase(texto);
    const chance = Math.min(0.5, 0.15 + conhecimento / 4000);
    if (frase && Math.random() < chance) return primeiraMaiuscula(frase);
  }

  // 8. Fallback final
  const RESPOSTAS_PADRAO = [
    "hmm, não entendi. reformula?", "que? kkkk fala de novo",
    "não peguei. explica melhor?", "pode explicar de outro jeito?",
    "interessante... me conta mais?", "sério? não sabia disso. continua",
  ];
  const RESPOSTAS_PERGUNTA = [
    "não sei te responder isso de cabeça. tenta reformular?",
    "essa me pegou kkkk manda de outro jeito",
    "hm, boa pergunta. não tenho certeza da resposta",
  ];
  const RESPOSTAS_EXCLAMACAO = ["uau", "aí sim!", "kkk que isso", "nossa!"];

  if (/\?\s*$/.test(texto.trim())) return escolher(RESPOSTAS_PERGUNTA);
  if (/!\s*$/.test(texto.trim())) return escolher(RESPOSTAS_EXCLAMACAO);
  return escolher(RESPOSTAS_PADRAO);
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

async function responderIA(texto, jidRemetente, extras = {}) {
  const { historico = [], contexto = "", imagemBase64 = null } = extras;

  if (!GATILHO.test(texto || "") && !imagemBase64) return null;

  const textoCorrigido = corrigirTexto(texto || "").replace(GATILHO, "").trim();
  const norm = normalizar(textoCorrigido);

  if (imagemBase64) {
    const perguntaVisual = /\b(imagem|foto|figura|desenho|aparece|mostra|vejo|identifica|descreve|descrever)\b/i.test(norm);
    const limiteVisao = "Ainda não tenho um modelo visual local instalado, então não vou fingir que reconheci o conteúdo da imagem. Descreve o que aparece e eu ajudo sem enviar a imagem para uma API.";
    if (!textoCorrigido || perguntaVisual) return limiteVisao;

    const respostaTexto = await responderIA(texto, jidRemetente, { historico, contexto });
    return respostaTexto ? `${respostaTexto}\n\n${limiteVisao}` : limiteVisao;
  }

  // 1. Comandos de aprendizado
  const cmdAprendizado = tratarComandoAprendizado(norm, jidRemetente);
  if (cmdAprendizado) return cmdAprendizado;

  // 2. Respostas especiais (pai/mãe/esposo)
  const especial = respostaEspecial(jidRemetente, textoCorrigido);
  if (especial) return especial;

  // 3. Aprende com a mensagem (sempre aprende)
  if (textoCorrigido) aprender(textoCorrigido);

  // 4. Regras locais primeiro: contas, data e pesquisa não devem ser substituídas
  // por uma resposta aprendida que apenas pareça semelhante.
  if (!imagemBase64) {
    // Matemática
    const conta = tentarMatematica(norm);
    if (conta) return conta;

    // Data/hora
    const dinamica = respostaDinamica(norm);
    if (dinamica) return dinamica;

    // Pesquisa web (se houver padrão de busca e pesquisar disponível)
    let termoBusca = null;
    for (const padrao of PADROES_BUSCA) {
          const casou = textoCorrigido.match(padrao);
      if (casou) { termoBusca = casou[1]; break; }
    }

    if (termoBusca) {
      const termo = termoBusca.replace(/\b(kok|miku)\b/gi, "").replace(/[?!.]+$/g, "").trim();
      if (termo.length >= 2) {
        try {
          const { pesquisar } = require("./pesquisa");
          const resultado = await pesquisar(termo);
          if (resultado) {
            aprender(resultado.texto);
            return `🔎 *${resultado.titulo}*\n${resultado.texto}`;
          }
        } catch (e) {}
      }
    }
  }

  // 5. Intenções, emoções e tópicos conhecidos antes da busca aproximada.
  const respostaDeterministica = gerarRespostaContextual(textoCorrigido, jidRemetente, historico, true);
  if (respostaDeterministica) return respostaDeterministica;

  // 6. Busca no aprendizado próprio (Q&A), depois das respostas verificáveis.
  if (!imagemBase64) {
    const aprendida = buscarNoAprendizado(norm, 0.5, jidRemetente);
    if (aprendida) {
      console.log(`🧠 Resposta da base Q&A (usos: ${aprendida.usos})`);
      return sanitizarResposta(aprendida.resposta, jidRemetente);
    }
  }

  // 7. Gerador de resposta contextual, busca semântica de menor confiança e fallback.
  const resposta = gerarRespostaContextual(textoCorrigido, jidRemetente, historico);
  if (resposta) {
    // Registra aprendizado
    if (!imagemBase64 && textoCorrigido) {
      const perguntaLimpa = textoCorrigido.replace(/\b(kok|miku)\b/gi, "").trim();
      if (perguntaLimpa.length > 3 && resposta) {
        registrarAprendizado(perguntaLimpa, resposta, jidRemetente, contexto.slice(0, 150));
      }
    }
    return resposta;
  }

  // 7. Fallback final
  if (!imagemBase64) {
    if (/\?\s*$/.test((texto || "").trim())) {
      return escolher(["não sei te responder isso de cabeça. tenta reformular?", "essa me pegou kkkk manda de outro jeito"]);
    }
    return escolher(["hmm, não entendi. reformula?", "que? kkkk fala de novo", "não peguei. explica melhor?"]);
  }

  return "puts, não consegui enxergar essa imagem agora 😔";
}

// ============================================================
// CARREGAR BASE E EXPORTAR
// ============================================================

carregarAprendizado();
reconstruirIndicePerguntas();

console.log(`🧠 IA Local 5.0 iniciada — 100% offline, sem APIs externas`);
console.log(`📚 Base Q&A: ${aprendizadoMiku.frases.length} pares | Markov: ${tamanhoDoConhecimento()} combinações`);

module.exports = {
  responderIA,
  JID_PAI,
  JID_MAE,
  JID_ESPOSO,
  adicionarMemoria,
  pegarHistorico,
  montarContexto,
  statusAprendizado: () => ({
    ativo: aprendizadoMiku.ativo,
    total: aprendizadoMiku.frases.length,
    criadoEm: aprendizadoMiku.criadoEm,
    atualizadoEm: aprendizadoMiku.atualizadoEm,
  }),
  ativarAprendizado: () => { aprendizadoMiku.ativo = true; salvarAprendizado(); return true; },
  desativarAprendizado: () => { aprendizadoMiku.ativo = false; salvarAprendizado(); return true; },
  limparAprendizado: () => { const t = aprendizadoMiku.frases.length; aprendizadoMiku.frases = []; salvarAprendizado(); return t; },
};