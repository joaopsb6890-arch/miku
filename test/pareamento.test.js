const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizarNumeroTelefone } = require("../lib/pareamento");

test("normaliza número internacional para o formato exigido pelo pareamento", () => {
  assert.equal(normalizarNumeroTelefone("+351 912-345-678"), "351912345678");
  assert.equal(normalizarNumeroTelefone("00351912345678"), "351912345678");
});

test("rejeita números curtos ou longos demais", () => {
  assert.throws(() => normalizarNumeroTelefone("1234567"), /8 e 15 dígitos/);
  assert.throws(() => normalizarNumeroTelefone("1234567890123456"), /8 e 15 dígitos/);
});
