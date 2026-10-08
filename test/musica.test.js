const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizarChave } = require("../lib/musica");

test("busca de música normaliza acentos e espaços para reutilizar o cache", () => {
  assert.equal(normalizarChave("  MÚSICA   ao vivo  "), "musica ao vivo");
});

test("busca de música ignora diferenças entre maiúsculas", () => {
  assert.equal(normalizarChave("Hatsune Miku"), normalizarChave("hatsune miku"));
});
