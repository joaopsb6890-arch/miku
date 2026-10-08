const MAX_TEXTO = 16_000;
const MAX_CARACTERES_TOTAL = 48_000;
const MAX_NOS = 4_000;
const MAX_PROFUNDIDADE = 20;
const MAX_CHAVES_OBJETO = 512;

const PADROES_NSFW = [
  /\b(?:porn(?:o|ografia|ografico)?|xxx|nsfw|hentai|nudes?)\b/i,
  /\b(?:nudes?\s+vazad[oa]s?|conteudo\s+adulto|sexo\s+explicito)\b/i,
  /\b(?:xvideos|xnxx|pornhub|xhamster|redtube|only\s*fans)\b/i,
];

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function detectarTextoNsfw(texto) {
  const normalizado = normalizarTexto(texto);
  return PADROES_NSFW.some((padrao) => padrao.test(normalizado));
}

function analisarTravazap(mensagem) {
  const raiz = mensagem?.message || mensagem;
  if (!raiz || typeof raiz !== "object") return null;

  const visitados = new WeakSet();
  const pilha = [{ valor: raiz, profundidade: 0 }];
  let nos = 0;
  let caracteres = 0;

  while (pilha.length) {
    const atual = pilha.pop();
    const valor = atual.valor;

    if (typeof valor === "string") {
      if (valor.length > MAX_TEXTO) return { codigo: "texto_extenso" };
      caracteres += valor.length;
      if (caracteres > MAX_CARACTERES_TOTAL) return { codigo: "payload_extenso" };

      const controles = valor.match(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g);
      if (controles && controles.length > 30) return { codigo: "caracteres_invalidos" };
      continue;
    }

    if (!valor || typeof valor !== "object") continue;
    if (Buffer.isBuffer(valor) || ArrayBuffer.isView(valor) || valor instanceof ArrayBuffer) continue;
    if (visitados.has(valor)) continue;
    visitados.add(valor);

    nos++;
    if (nos > MAX_NOS) return { codigo: "payload_complexo" };
    if (atual.profundidade > MAX_PROFUNDIDADE) return { codigo: "payload_aninhado" };

    let chaves;
    try {
      chaves = Object.keys(valor);
    } catch {
      return { codigo: "payload_invalido" };
    }
    if (chaves.length > MAX_CHAVES_OBJETO) return { codigo: "payload_complexo" };

    for (const chave of chaves) {
      pilha.push({ valor: valor[chave], profundidade: atual.profundidade + 1 });
    }
  }

  return null;
}

module.exports = { analisarTravazap, detectarTextoNsfw, normalizarTexto };
