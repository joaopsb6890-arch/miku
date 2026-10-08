const TAREFAS_DIARIAS = [
  { id: "mensagens", nome: "Converse no grupo", acao: "mensagens", alvo: 10, moedas: 20 },
  { id: "jogos", nome: "Jogue minijogos", acao: "jogos", alvo: 2, moedas: 25 },
  { id: "pet", nome: "Cuide do seu pet", acao: "pet", alvo: 1, moedas: 15 },
];

function dataAtual(data = new Date()) {
  return data.toISOString().slice(0, 10);
}

function criarMissoesDiarias(usuario, data = new Date()) {
  const hoje = dataAtual(data);
  if (usuario.missoesDiarias?.data !== hoje) {
    usuario.missoesDiarias = {
      data: hoje,
      progresso: { mensagens: 0, jogos: 0, pet: 0 },
      resgatadas: [],
    };
  } else {
    if (!usuario.missoesDiarias.progresso || typeof usuario.missoesDiarias.progresso !== "object") {
      usuario.missoesDiarias.progresso = { mensagens: 0, jogos: 0, pet: 0 };
    }
    if (!Array.isArray(usuario.missoesDiarias.resgatadas)) usuario.missoesDiarias.resgatadas = [];
  }
  return usuario.missoesDiarias;
}

function registrarProgressoMissao(usuario, acao, quantidade = 1, data = new Date()) {
  const missoes = criarMissoesDiarias(usuario, data);
  const tarefa = TAREFAS_DIARIAS.find((item) => item.acao === acao);
  if (!tarefa || !Number.isFinite(quantidade) || quantidade <= 0) return missoes;
  missoes.progresso[acao] = Math.min(tarefa.alvo, (missoes.progresso[acao] || 0) + quantidade);
  return missoes;
}

function listarMissoes(usuario, data = new Date()) {
  const missoes = criarMissoesDiarias(usuario, data);
  return TAREFAS_DIARIAS.map((tarefa) => ({
    ...tarefa,
    progresso: Math.min(tarefa.alvo, missoes.progresso[tarefa.acao] || 0),
    resgatada: missoes.resgatadas.includes(tarefa.id),
  }));
}

function resgatarMissoes(usuario, data = new Date()) {
  const missoes = criarMissoesDiarias(usuario, data);
  const concluidas = listarMissoes(usuario, data)
    .filter((tarefa) => !tarefa.resgatada && tarefa.progresso >= tarefa.alvo);

  if (concluidas.length === 0) return { tarefas: [], moedas: 0 };

  const moedas = concluidas.reduce((total, tarefa) => total + tarefa.moedas, 0);
  missoes.resgatadas.push(...concluidas.map((tarefa) => tarefa.id));
  usuario.moedas = Math.max(0, Number(usuario.moedas) || 0) + moedas;
  return { tarefas: concluidas, moedas };
}

function resgatarBonusDiario(usuario, data = new Date()) {
  const hoje = dataAtual(data);
  const diario = usuario.bonusDiario || { ultimaData: null, sequencia: 0 };
  const sequenciaAnterior = Math.max(0, Number(diario.sequencia) || 0);

  if (diario.ultimaData === hoje) {
    return { resgatado: false, moedas: 0, sequencia: sequenciaAnterior };
  }

  const ontem = new Date(`${hoje}T00:00:00.000Z`);
  ontem.setUTCDate(ontem.getUTCDate() - 1);
  const manteveSequencia = diario.ultimaData === dataAtual(ontem);
  const sequencia = manteveSequencia ? Math.min(sequenciaAnterior + 1, 7) : 1;
  const moedas = 20 + (sequencia - 1) * 5;

  usuario.bonusDiario = { ultimaData: hoje, sequencia };
  usuario.moedas = Math.max(0, Number(usuario.moedas) || 0) + moedas;
  return { resgatado: true, moedas, sequencia };
}

module.exports = {
  TAREFAS_DIARIAS,
  criarMissoesDiarias,
  listarMissoes,
  registrarProgressoMissao,
  resgatarMissoes,
  resgatarBonusDiario,
};
