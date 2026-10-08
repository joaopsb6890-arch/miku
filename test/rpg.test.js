const test = require("node:test");
const assert = require("node:assert/strict");
const { criarPet, cuidarPet, curarPet, ganharXpPet } = require("../lib/rpg");

test("cuidado do pet preserva progresso fracionado de tempo", () => {
  const pet = criarPet("gato", "Mimi");
  const inicio = 1_000_000;
  pet.ultimoCuidado = inicio;

  cuidarPet(pet, inicio + 30_000);

  assert.equal(pet.fome, 0.25);
  assert.equal(pet.ultimoCuidado, inicio + 30_000);
});

test("cura de pet respeita a vida máxima e retorna a quantidade curada", () => {
  const pet = criarPet("gato", "Mimi");
  pet.vida = 45;

  assert.equal(curarPet(pet, 30), 5);
  assert.equal(pet.vida, pet.vidaMax);
  assert.equal(curarPet(pet, 30), 0);
});

test("XP do pet aplica níveis, atributos e vida restaurada", () => {
  const pet = criarPet("gato", "Mimi");
  pet.xp = 45;

  const resultado = ganharXpPet(pet, 70);

  assert.deepEqual(resultado, { subiuNivel: true, niveis: 1 });
  assert.equal(pet.nivel, 2);
  assert.equal(pet.xp, 65);
  assert.equal(pet.vida, pet.vidaMax);
});
