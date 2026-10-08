function scorePergunta(tokensPergunta, tokensDocumento, frequencias, totalDocumentos, fraseExata = false) {
  const pergunta = new Set(tokensPergunta);
  const documento = new Set(tokensDocumento);
  if (!pergunta.size || !documento.size) return 0;

  const total = Math.max(1, totalDocumentos);
  const peso = (token) => {
    const frequencia = frequencias.get(token) || 0;
    return Math.log(1 + (total - frequencia + 0.5) / (frequencia + 0.5));
  };

  let pesoPergunta = 0;
  let pesoDocumento = 0;
  let pesoCorrespondente = 0;

  for (const token of pergunta) {
    const idf = peso(token);
    pesoPergunta += idf;
    if (documento.has(token)) pesoCorrespondente += idf;
  }
  for (const token of documento) pesoDocumento += peso(token);

  const cobertura = pesoPergunta ? pesoCorrespondente / pesoPergunta : 0;
  const precisao = pesoDocumento ? pesoCorrespondente / pesoDocumento : 0;
  return Math.min(1, cobertura * 0.72 + precisao * 0.18 + (fraseExata ? 0.1 : 0));
}

function fraseDisponivelParaUsuario(frase, jidRemetente) {
  return !frase?.jid || (!!jidRemetente && frase.jid === jidRemetente);
}

module.exports = { scorePergunta, fraseDisponivelParaUsuario };
