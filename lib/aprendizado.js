/**
 * Aprendizado local e silencioso: o bot observa as mensagens do grupo
 * e constrói uma cadeia de PARES de palavras -> próxima palavra
 * (Markov de 2ª ordem). Tudo local, sem nenhuma API externa.
 *
 * Melhorias desta versão:
 * - Aprende FRASE POR FRASE (separa por . ! ? ,), em vez da mensagem inteira
 *   de uma vez — isso evita misturar o fim de uma ideia com o começo de outra
 *   completamente diferente, deixando o texto gerado mais coerente.
 * - Marca começo (<INICIO>) e fim (<FIM>) de frase na cadeia, então a IA
 *   sabe quando é natural começar e parar uma frase gerada, em vez de sempre
 *   cortar no limite de tamanho.
 * - Guarda também um vocabulário simples (palavra -> quantas vezes apareceu),
 *   útil pra estatísticas e pra escolher uma palavra-semente melhor.
 */

const { db, salvar } = require("./db");

const LIMITE_RAMOS_POR_CHAVE = 40;
const MARCA_INICIO = "<INICIO>";
const MARCA_FIM = "<FIM>";

function limparTexto(texto) {
  return texto
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((p) => p.length > 0 && p.length < 25);
}

// Separa uma mensagem em frases (por pontuação), pra aprender cada ideia isoladamente
function separarFrases(texto) {
  return texto
    .split(/[.!?;\n]+|,\s+(?=e\s|mas\s|por[ée]m\s|ent[ãa]o\s)/gi)
    .map((f) => f.trim())
    .filter(Boolean);
}

function registrarLigacao(chave, proxima) {
  if (!db.cadeiaAprendizado[chave]) db.cadeiaAprendizado[chave] = {};
  const ramos = db.cadeiaAprendizado[chave];

  if (!ramos[proxima] && Object.keys(ramos).length >= LIMITE_RAMOS_POR_CHAVE) {
    return; // já aprendeu demais variações raras dessa combinação
  }
  ramos[proxima] = (ramos[proxima] || 0) + 1;
}

// Aprende silenciosamente com uma mensagem normal (chamado pra toda mensagem que não é comando)
function aprender(texto) {
  if (!db.cadeiaAprendizado) db.cadeiaAprendizado = {};
  if (!db.vocabulario) db.vocabulario = {};

  const frases = separarFrases(texto);
  let aprendeuAlgo = false;

  for (const frase of frases) {
    const palavras = limparTexto(frase);
    if (palavras.length < 3) continue;
    aprendeuAlgo = true;

    for (const p of palavras) {
      db.vocabulario[p] = (db.vocabulario[p] || 0) + 1;
    }

    // marca o início da frase, pra IA saber com o que é natural começar
    registrarLigacao(MARCA_INICIO, palavras[0]);

    for (let i = 0; i < palavras.length - 2; i++) {
      const chave = `${palavras[i]} ${palavras[i + 1]}`;
      registrarLigacao(chave, palavras[i + 2]);
    }

    // marca o fim da frase, pra IA saber quando é natural parar
    const chaveFinal = `${palavras[palavras.length - 2]} ${palavras[palavras.length - 1]}`;
    registrarLigacao(chaveFinal, MARCA_FIM);
  }

  if (aprendeuAlgo) salvar();
}

function escolherPonderado(mapa) {
  const entradas = Object.entries(mapa);
  const total = entradas.reduce((soma, [, peso]) => soma + peso, 0);
  let alvo = Math.random() * total;
  for (const [palavra, peso] of entradas) {
    alvo -= peso;
    if (alvo <= 0) return palavra;
  }
  return entradas[entradas.length - 1][0];
}

// Gera uma frase nova a partir do que já foi aprendido, tentando começar
// por um par de palavras relacionado com a mensagem que disparou a IA
function gerarFrase(textoGatilho, tamanhoMax = 12) {
  const cadeia = db.cadeiaAprendizado || {};
  const chaves = Object.keys(cadeia).filter((c) => c !== MARCA_INICIO);
  if (chaves.length === 0) return null;

  const palavrasGatilho = limparTexto(textoGatilho);
  const chavesCandidatas = chaves.filter((chave) =>
    chave.split(" ").some((palavra) => palavrasGatilho.includes(palavra))
  );

  let p1, p2;
  if (chavesCandidatas.length > 0) {
    [p1, p2] = chavesCandidatas[Math.floor(Math.random() * chavesCandidatas.length)].split(" ");
  } else if (cadeia[MARCA_INICIO]) {
    // começa com uma palavra que já apareceu no início de alguma frase aprendida — mais natural
    const primeira = escolherPonderado(cadeia[MARCA_INICIO]);
    const candidatasComEssaPalavra = chaves.filter((c) => c.startsWith(primeira + " "));
    if (candidatasComEssaPalavra.length > 0) {
      [p1, p2] = candidatasComEssaPalavra[Math.floor(Math.random() * candidatasComEssaPalavra.length)].split(" ");
    } else {
      [p1, p2] = chaves[Math.floor(Math.random() * chaves.length)].split(" ");
    }
  } else {
    [p1, p2] = chaves[Math.floor(Math.random() * chaves.length)].split(" ");
  }

  const frase = [p1, p2];

  for (let i = 0; i < tamanhoMax; i++) {
    const proximos = cadeia[`${p1} ${p2}`];
    if (!proximos || Object.keys(proximos).length === 0) break;

    const proxima = escolherPonderado(proximos);
    if (proxima === MARCA_FIM) break; // chegou num fim de frase aprendido — para naturalmente

    // evita ficar repetindo a mesma palavra em loop
    if (frase[frase.length - 1] === proxima && frase[frase.length - 2] === proxima) break;

    frase.push(proxima);
    p1 = p2;
    p2 = proxima;
  }

  if (frase.length < 4) return null; // aprendeu pouco ainda, melhor não arriscar algo curto
  return frase.join(" ");
}

// Quantas combinações de par->próxima palavra o bot já aprendeu
function tamanhoDoConhecimento() {
  const cadeia = db.cadeiaAprendizado || {};
  return Object.entries(cadeia)
    .filter(([chave]) => chave !== MARCA_INICIO)
    .reduce((soma, [, ramos]) => soma + Object.keys(ramos).filter((p) => p !== MARCA_FIM).length, 0);
}

// Quantas palavras distintas já foram vistas (vocabulário)
function tamanhoDoVocabulario() {
  return Object.keys(db.vocabulario || {}).length;
}

module.exports = { aprender, gerarFrase, tamanhoDoConhecimento, tamanhoDoVocabulario };
