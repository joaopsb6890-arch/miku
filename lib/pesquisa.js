/**
 * Pesquisa rápida usando fontes públicas gratuitas, sem precisar de nenhuma
 * chave de API (diferente de uma IA paga como Groq/OpenAI):
 *
 * 1. Wikipédia em português — boa pra pessoas, lugares, conceitos, eventos.
 * 2. DuckDuckGo Instant Answer — usado como reforço quando a Wikipédia não
 *    tem uma página exata (ele resume várias fontes, tipo definições rápidas).
 *
 * A função `pesquisar` tenta a Wikipédia primeiro e só recorre ao DuckDuckGo
 * se a primeira não achar nada.
 */

// Busca com timeout, pra não ficar travado esperando uma conexão lenta
async function buscarComTimeout(url, opcoes = {}, timeoutMs = 6000) {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opcoes, signal: controlador.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function pesquisarWikipedia(termo) {
  try {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termo)}`;
    const resposta = await buscarComTimeout(url, { headers: { "User-Agent": "MeuBotWhatsApp/1.0 (uso pessoal)" } });
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    if (!dados.extract || dados.type === "disambiguation") return null;

    const texto = dados.extract.length > 450 ? dados.extract.slice(0, 450) + "..." : dados.extract;
    return { texto, titulo: dados.title, fonte: "Wikipédia" };
  } catch (erro) {
    console.error("Erro na pesquisa (Wikipédia):", erro.message);
    return null;
  }
}

async function pesquisarDuckDuckGo(termo) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(termo)}&format=json&no_html=1&skip_disambig=1&kl=br-pt`;
    const resposta = await buscarComTimeout(url, { headers: { "User-Agent": "MeuBotWhatsApp/1.0 (uso pessoal)" } });
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    const textoBruto = dados.AbstractText || dados.Answer || dados.Definition || null;
    if (!textoBruto) return null;

    const texto = textoBruto.length > 450 ? textoBruto.slice(0, 450) + "..." : textoBruto;
    const titulo = dados.Heading || termo;
    return { texto, titulo, fonte: "DuckDuckGo" };
  } catch (erro) {
    console.error("Erro na pesquisa (DuckDuckGo):", erro.message);
    return null;
  }
}

// Tenta as fontes em ordem até uma dar resultado
async function pesquisar(termo) {
  const wiki = await pesquisarWikipedia(termo);
  if (wiki) return wiki;

  const duck = await pesquisarDuckDuckGo(termo);
  if (duck) return duck;

  return null;
}

module.exports = { pesquisar, pesquisarWikipedia, pesquisarDuckDuckGo };
