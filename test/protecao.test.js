const test = require("node:test");
const assert = require("node:assert/strict");
const { analisarTravazap, detectarTextoNsfw } = require("../lib/protecao");

test("anti-trava zap aceita mensagens comuns e ignora anexos binários", () => {
  const mensagem = {
    message: {
      conversation: "Olá, tudo bem?",
      imageMessage: { mimetype: "image/jpeg", jpegThumbnail: Buffer.from([1, 2, 3]) },
    },
  };
  assert.equal(analisarTravazap(mensagem), null);
});

test("anti-trava zap identifica texto excessivamente grande", () => {
  const resultado = analisarTravazap({ message: { conversation: "x".repeat(16_001) } });
  assert.equal(resultado.codigo, "texto_extenso");
});

test("anti-trava zap limita aninhamento e complexidade", () => {
  let aninhada = {};
  let cursor = aninhada;
  for (let i = 0; i < 22; i++) {
    cursor.proximo = {};
    cursor = cursor.proximo;
  }
  assert.equal(analisarTravazap(aninhada).codigo, "payload_aninhado");

  const complexa = { dados: Array.from({ length: 4_100 }, () => ({})) };
  assert.equal(analisarTravazap(complexa).codigo, "payload_complexo");
});

test("anti-NSFW reconhece termos explícitos sem acento e domínios adultos", () => {
  assert.equal(detectarTextoNsfw("conteúdo adulto e sexo explícito"), true);
  assert.equal(detectarTextoNsfw("https://www.xvideos.com/video"), true);
  assert.equal(detectarTextoNsfw("vamos conversar sobre jogos e música"), false);
});
