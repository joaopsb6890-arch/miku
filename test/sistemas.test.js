const test = require("node:test");
const assert = require("node:assert/strict");
const {
  listarMissoes,
  registrarProgressoMissao,
  resgatarMissoes,
  resgatarBonusDiario,
} = require("../lib/sistemas");

test("missões reiniciam por dia e limitam progresso ao objetivo", () => {
  const usuario = { moedas: 0 };
  registrarProgressoMissao(usuario, "mensagens", 20, new Date("2026-10-07T12:00:00Z"));
  const hoje = listarMissoes(usuario, new Date("2026-10-07T12:00:00Z"));
  const amanha = listarMissoes(usuario, new Date("2026-10-08T12:00:00Z"));

  assert.equal(hoje.find((tarefa) => tarefa.id === "mensagens").progresso, 10);
  assert.equal(amanha.find((tarefa) => tarefa.id === "mensagens").progresso, 0);
});

test("estado parcial antigo de missões é migrado sem erro", () => {
  const usuario = { missoesDiarias: { data: "2026-10-07" } };
  const tarefas = listarMissoes(usuario, new Date("2026-10-07T12:00:00Z"));
  assert.equal(tarefas.length, 3);
  assert.deepEqual(usuario.missoesDiarias.progresso, { mensagens: 0, jogos: 0, pet: 0 });
});

test("missões concluídas podem ser resgatadas apenas uma vez", () => {
  const usuario = { moedas: 5 };
  const hoje = new Date("2026-10-07T12:00:00Z");
  registrarProgressoMissao(usuario, "jogos", 2, hoje);

  const primeiroResgate = resgatarMissoes(usuario, hoje);
  const segundoResgate = resgatarMissoes(usuario, hoje);

  assert.equal(primeiroResgate.moedas, 25);
  assert.equal(primeiroResgate.tarefas.length, 1);
  assert.equal(segundoResgate.moedas, 0);
  assert.equal(usuario.moedas, 30);
});

test("bônus diário impede repetição e mantém sequência consecutiva", () => {
  const usuario = { moedas: 0 };
  const primeiroDia = resgatarBonusDiario(usuario, new Date("2026-10-07T12:00:00Z"));
  const repetido = resgatarBonusDiario(usuario, new Date("2026-10-07T18:00:00Z"));
  const diaSeguinte = resgatarBonusDiario(usuario, new Date("2026-10-08T08:00:00Z"));

  assert.equal(primeiroDia.moedas, 20);
  assert.equal(repetido.resgatado, false);
  assert.equal(diaSeguinte.moedas, 25);
  assert.equal(diaSeguinte.sequencia, 2);
  assert.equal(usuario.moedas, 45);
});
