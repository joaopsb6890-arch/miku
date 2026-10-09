const test = require("node:test");
const assert = require("node:assert/strict");
const {
  configuracaoModelo,
  montarMensagens,
  gerarRespostaModelo,
} = require("../lib/ia-modelo");

test("o modelo externo fica desligado sem uma chave explicitamente configurada", () => {
  assert.equal(configuracaoModelo({}), null);
  assert.equal(configuracaoModelo({ AI_API_KEY: "   " }), null);
});

test("mensagens do modelo preservam contexto conversacional e limitam histórico", () => {
  const historico = Array.from({ length: 12 }, (_, i) => ({
    role: i % 2 ? "assistant" : "user",
    content: `turno-${i}`,
  }));
  const mensagens = montarMensagens({ texto: "e depois?", historico, contexto: "conversa privada" });

  assert.equal(mensagens.length, 12); // instruções + 10 mensagens + pergunta atual
  assert.equal(mensagens[1].content, "turno-2");
  assert.equal(mensagens.at(-1).content, "e depois?");
  assert.match(mensagens[0].content, /Não inventes factos/);
});

test("o adaptador envia ao endpoint compatível e devolve a resposta do modelo", async () => {
  const fetchOriginal = global.fetch;
  let pedido;
  global.fetch = async (url, options) => {
    pedido = { url, options };
    return new Response(JSON.stringify({
      choices: [{ message: { content: "Resposta útil." } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const resposta = await gerarRespostaModelo(
      { texto: "pergunta", historico: [{ role: "user", content: "antes" }] },
      { AI_API_KEY: "teste", AI_BASE_URL: "https://exemplo.test/v1", AI_MODEL: "modelo-teste" },
    );
    assert.equal(resposta, "Resposta útil.");
    assert.equal(pedido.url, "https://exemplo.test/v1/chat/completions");
    assert.equal(pedido.options.headers.Authorization, "Bearer teste");
    assert.equal(JSON.parse(pedido.options.body).messages.at(-1).content, "pergunta");
  } finally {
    global.fetch = fetchOriginal;
  }
});
