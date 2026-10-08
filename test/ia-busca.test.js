const test = require("node:test");
const assert = require("node:assert/strict");
const { scorePergunta, fraseDisponivelParaUsuario } = require("../lib/ia-busca");

test("a busca local dá prioridade à pergunta com maior correspondência de conteúdo", () => {
  const frequencias = new Map([
    ["como", 80],
    ["adotar", 4],
    ["pet", 12],
    ["música", 30],
  ]);
  const pergunta = ["como", "adotar", "pet"];
  const exata = scorePergunta(pergunta, ["como", "adotar", "um", "pet"], frequencias, 100, true);
  const distração = scorePergunta(pergunta, ["como", "ouvir", "música"], frequencias, 100, false);
  assert.ok(exata > distração);
});

test("a busca local retorna zero para documentos sem tokens em comum", () => {
  const score = scorePergunta(["gato", "brincar"], ["chuva", "praia"], new Map(), 10);
  assert.equal(score, 0);
});

test("aprendizado privado só fica disponível para a própria pessoa", () => {
  assert.equal(fraseDisponivelParaUsuario({ jid: "user-a" }, "user-a"), true);
  assert.equal(fraseDisponivelParaUsuario({ jid: "user-a" }, "user-b"), false);
  assert.equal(fraseDisponivelParaUsuario({ jid: null }, "user-b"), true);
});
