/**
 * RPG 2.0 — Sistema expandido
 * - Personagens com classes
 * - Sistema de Pets
 * - Batalha por golpes (turnos com poderes)
 * - Batalha entre dois membros
 * - Batalha entre monstros
 * - Batalha dinâmica com botões
 * - Loja ampliada
 */

// ============================================================
// CLASSES RPG
// ============================================================

const CLASSES_RPG = {
  guerreiro: {
    nome: "Guerreiro", emoji: "⚔️", vidaMax: 120, ataque: 15, defesa: 12,
    poderes: [
      { id: "corte", nome: "Corte Selvagem", custo: 0, dano: 1.0, tipo: "ataque", emoji: "⚔️" },
      { id: "investida", nome: "Investida Brutal", custo: 15, dano: 1.6, tipo: "ataque", emoji: "💥" },
      { id: "defesa", nome: "Postura Defensiva", custo: 10, dano: 0, tipo: "defesa", emoji: "🛡️", bonus: 8 },
      { id: "furia", nome: "Fúria Berserker", custo: 25, dano: 2.2, tipo: "ataque", emoji: "😡" },
    ],
  },
  mago: {
    nome: "Mago", emoji: "🧙", vidaMax: 80, ataque: 20, defesa: 6,
    poderes: [
      { id: "chama", nome: "Bola de Fogo", custo: 0, dano: 1.0, tipo: "ataque", emoji: "🔥" },
      { id: "raio", nome: "Raio Arcano", custo: 15, dano: 1.5, tipo: "ataque", emoji: "⚡" },
      { id: "cura", nome: "Cura Mágica", custo: 20, dano: 0, tipo: "cura", emoji: "💚", cura: 30 },
      { id: "meteor", nome: "Meteoro", custo: 35, dano: 2.5, tipo: "ataque", emoji: "☄️" },
    ],
  },
  arqueiro: {
    nome: "Arqueiro", emoji: "🏹", vidaMax: 100, ataque: 17, defesa: 9,
    poderes: [
      { id: "flecha", nome: "Flecha Rápida", custo: 0, dano: 1.0, tipo: "ataque", emoji: "🏹" },
      { id: "chuvo", nome: "Chuva de Flechas", custo: 15, dano: 1.4, tipo: "ataque", emoji: "🎯" },
      { id: "agilidade", nome: "Esquiva Ágil", custo: 10, dano: 0, tipo: "defesa", emoji: "💨", bonus: 6 },
      { id: "furacao", nome: "Furacão de Flechas", custo: 30, dano: 2.0, tipo: "ataque", emoji: "🌪️" },
    ],
  },
  ladino: {
    nome: "Ladino", emoji: "🗡️", vidaMax: 90, ataque: 16, defesa: 8,
    poderes: [
      { id: "golpe", nome: "Golpe Suave", custo: 0, dano: 1.0, tipo: "ataque", emoji: "🗡️" },
      { id: "veneno", nome: "Lâmina Venenosa", custo: 15, dano: 1.3, tipo: "ataque", emoji: "☠️", dot: 5 },
      { id: "furtividade", nome: "Furtividade", custo: 10, dano: 0, tipo: "defesa", emoji: "🌑", bonus: 5 },
      { id: "assassinar", nome: "Assassinato", custo: 30, dano: 2.3, tipo: "ataque", emoji: "💀" },
    ],
  },
};

// ============================================================
// MONSTROS
// ============================================================

const MONSTROS = [
  { nome: "Goblin", emoji: "👺", vida: 40, ataque: 8, defesa: 2, xp: 15, ouro: 10,
    poderes: [{ nome: "Porrada", dano: 1.0, emoji: "👊" }, { nome: "Mordida", dano: 1.2, emoji: "🦷" }] },
  { nome: "Lobo Selvagem", emoji: "🐺", vida: 55, ataque: 10, defesa: 3, xp: 20, ouro: 15,
    poderes: [{ nome: "Mordida", dano: 1.1, emoji: "🦷" }, { nome: "Garra", dano: 1.3, emoji: "🐾" }] },
  { nome: "Esqueleto", emoji: "💀", vida: 70, ataque: 12, defesa: 5, xp: 28, ouro: 20,
    poderes: [{ nome: "Espadada", dano: 1.0, emoji: "⚔️" }, { nome: "Ossada", dano: 1.4, emoji: "🦴" }] },
  { nome: "Orc Brutamontes", emoji: "👹", vida: 90, ataque: 14, defesa: 6, xp: 35, ouro: 28,
    poderes: [{ nome: "Clavada", dano: 1.2, emoji: "🔨" }, { nome: "Rugido", dano: 1.5, emoji: "📢" }] },
  { nome: "Troll das Montanhas", emoji: "🧌", vida: 120, ataque: 18, defesa: 8, xp: 50, ouro: 40,
    poderes: [{ nome: "Soco", dano: 1.1, emoji: "👊" }, { nome: "Arremesso", dano: 1.6, emoji: "🪨" }] },
  { nome: "Dragão Jovem", emoji: "🐉", vida: 200, ataque: 25, defesa: 12, xp: 100, ouro: 80,
    poderes: [{ nome: "Sopro de Fogo", dano: 1.4, emoji: "🔥" }, { nome: "Garra Dragão", dano: 1.8, emoji: "🐉" }] },
  { nome: "Necromante", emoji: "🧟", vida: 150, ataque: 22, defesa: 7, xp: 80, ouro: 60,
    poderes: [{ nome: "Maldição", dano: 1.3, emoji: "💀" }, { nome: "Invocar Mortos", dano: 1.6, emoji: "🧟" }] },
  { nome: "Golem de Pedra", emoji: "🗿", vida: 250, ataque: 20, defesa: 15, xp: 90, ouro: 70,
    poderes: [{ nome: "Punho de Pedra", dano: 1.5, emoji: "🪨" }, { nome: "Terremoto", dano: 2.0, emoji: "🌋" }] },
];

// ============================================================
// SISTEMA DE PETS
// ============================================================

const PETS_DISPONIVEIS = [
  { tipo: "cachorro", emoji: "🐶", nome: "Cachorro", vidaMax: 60, ataque: 8, defesa: 4 },
  { tipo: "gato", emoji: "🐱", nome: "Gato", vidaMax: 50, ataque: 7, defesa: 3 },
  { tipo: "dragao", emoji: "🐲", nome: "Dragão Bebê", vidaMax: 80, ataque: 12, defesa: 6 },
  { tipo: "fenix", emoji: "🦅", nome: "Fênix", vidaMax: 70, ataque: 11, defesa: 5 },
  { tipo: "lobo", emoji: "🐺", nome: "Lobo", vidaMax: 65, ataque: 10, defesa: 4 },
  { tipo: "tartaruga", emoji: "🐢", nome: "Tartaruga", vidaMax: 90, ataque: 6, defesa: 8 },
  { tipo: "raposa", emoji: "🦊", nome: "Raposa", vidaMax: 55, ataque: 9, defesa: 3 },
  { tipo: "tigre", emoji: "🐯", nome: "Tigre", vidaMax: 75, ataque: 11, defesa: 5 },
  { tipo: "panda", emoji: "🐼", nome: "Panda", vidaMax: 70, ataque: 8, defesa: 7 },
  { tipo: "coruja", emoji: "🦉", nome: "Coruja", vidaMax: 50, ataque: 10, defesa: 3 },
];

const PET_PODERES = {
  cachorro: [
    { id: "mordida", nome: "Mordida", custo: 0, dano: 1.0, emoji: "🦷" },
    { id: "investida", nome: "Investida", custo: 10, dano: 1.5, emoji: "💨" },
    { id: "uivo", nome: "Uivo de Guerra", custo: 15, dano: 0, emoji: "📢", tipo: "buff" },
  ],
  gato: [
    { id: "arranhao", nome: "Arranhão", custo: 0, dano: 1.0, emoji: "🐾" },
    { id: "pulo", nome: "Pulo Felino", custo: 10, dano: 1.4, emoji: "🐱" },
    { id: "ronronar", nome: "Ronronar", custo: 15, dano: 0, emoji: "💕", tipo: "cura", cura: 20 },
  ],
  dragao: [
    { id: "fogo", nome: "Sopro de Fogo", custo: 0, dano: 1.0, emoji: "🔥" },
    { id: "garras", nome: "Garra Dragão", custo: 15, dano: 1.6, emoji: "🐉" },
    { id: "rugido", nome: "Rugido", custo: 20, dano: 0, emoji: "📢", tipo: "buff" },
  ],
  fenix: [
    { id: "bico", nome: "Bicada", custo: 0, dano: 1.0, emoji: "🦅" },
    { id: "asa", nome: "Vento das Asas", custo: 12, dano: 1.4, emoji: "🌬️" },
    { id: "renascer", nome: "Renascer", custo: 25, dano: 0, emoji: "✨", tipo: "cura", cura: 30 },
  ],
  lobo: [
    { id: "mordida", nome: "Mordida", custo: 0, dano: 1.0, emoji: "🐺" },
    { id: "garra", nome: "Garra Selvagem", custo: 12, dano: 1.5, emoji: "🐾" },
    { id: "uivo", nome: "Uivo Lunar", custo: 18, dano: 0, emoji: "🌙", tipo: "buff" },
  ],
  tartaruga: [
    { id: "mordida", nome: "Mordida", custo: 0, dano: 1.0, emoji: "🐢" },
    { id: "concha", nome: "Concha Protetora", custo: 10, dano: 0, emoji: "🛡️", tipo: "defesa", bonus: 8 },
    { id: "investida", nome: "Investida de Casco", custo: 15, dano: 1.6, emoji: "💚" },
  ],
  raposa: [
    { id: "arranhao", nome: "Arranhão", custo: 0, dano: 1.0, emoji: "🦊" },
    { id: "fofoqueiro", nome: "Lábia", custo: 12, dano: 1.3, emoji: "😏", tipo: "debuff" },
    { id: "pulo", nome: "Pulo Raposa", custo: 15, dano: 1.5, emoji: "💨" },
  ],
  tigre: [
    { id: "garra", nome: "Garra de Tigre", custo: 0, dano: 1.0, emoji: "🐯" },
    { id: "investida", nome: "Investida Predadora", custo: 15, dano: 1.7, emoji: "💨" },
    { id: "rugido", nome: "Rugido Selvagem", custo: 20, dano: 0, emoji: "📢", tipo: "buff" },
  ],
  panda: [
    { id: "pata", nome: "Pata", custo: 0, dano: 1.0, emoji: "🐼" },
    { id: "abracar", nome: "Abraço de Urso", custo: 12, dano: 1.4, emoji: "🤗" },
    { id: "rolar", nome: "Rolar", custo: 18, dano: 0, emoji: "🌀", tipo: "defesa", bonus: 10 },
  ],
  coruja: [
    { id: "bico", nome: "Bicada", custo: 0, dano: 1.0, emoji: "🦉" },
    { id: "voo", nome: "Mergulho Aéreo", custo: 12, dano: 1.6, emoji: "🦅" },
    { id: "sabedoria", nome: "Sabedoria", custo: 18, dano: 0, emoji: "✨", tipo: "cura", cura: 15 },
  ],
};

function criarPet(tipoPet, nomePet) {
  const base = PETS_DISPONIVEIS.find((p) => p.tipo === tipoPet);
  if (!base) return null;
  return {
    tipo: base.tipo,
    emoji: base.emoji,
    nome: nomePet || base.nome,
    nivel: 1,
    xp: 0,
    xpMax: 50,
    vida: base.vidaMax,
    vidaMax: base.vidaMax,
    ataque: base.ataque,
    defesa: base.defesa,
    energia: 100,
    fome: 0, // 0 = sem fome, 100 = com muita fome
    carinho: 50, // 0-100
    felicidade: 50, // 0-100
    ultimoCuidado: Date.now(),
  };
}

function cuidarPet(pet, agora = Date.now()) {
  if (!pet) return;
  const instante = Number.isFinite(agora) ? agora : Date.now();
  pet.fome = Math.max(0, Math.min(100, Number(pet.fome) || 0));
  pet.felicidade = Math.max(0, Math.min(100, Number(pet.felicidade) || 50));
  pet.energia = Math.max(0, Math.min(100, Number(pet.energia) || 0));
  pet.carinho = Math.max(0, Math.min(100, Number(pet.carinho) || 50));
  const ultimoCuidado = Number(pet.ultimoCuidado) || instante;
  const diffMin = Math.max(0, Math.min(60 * 24 * 7, (instante - ultimoCuidado) / 60000));

  // Fome aumenta com o tempo
  pet.fome = Math.min(100, (pet.fome || 0) + diffMin * 0.5);
  // Energia regenera com o tempo
  pet.energia = Math.min(100, (pet.energia || 0) + diffMin * 0.3);
  // Felicidade diminui se com fome
  if (pet.fome > 70) pet.felicidade = Math.max(0, (pet.felicidade || 50) - diffMin * 0.2);

  pet.ultimoCuidado = instante;
}

function alimentarPet(pet) {
  pet.fome = Math.max(0, (pet.fome || 0) - 40);
  pet.felicidade = Math.min(100, (pet.felicidade || 50) + 10);
  pet.energia = Math.min(100, (pet.energia || 0) + 15);
  return pet.fome;
}

function curarPet(pet, quantidade = 25) {
  if (!pet) return 0;
  const vidaMax = Math.max(1, Number(pet.vidaMax) || 1);
  pet.vida = Math.max(0, Math.min(vidaMax, Number(pet.vida) || 0));
  const anterior = pet.vida;
  pet.vida = Math.min(vidaMax, pet.vida + Math.max(0, Number(quantidade) || 0));
  return pet.vida - anterior;
}

function ganharXpPet(pet, quantidade) {
  if (!pet) return { subiuNivel: false, niveis: 0 };
  pet.xp = Math.max(0, Number(pet.xp) || 0) + Math.max(0, Number(quantidade) || 0);
  pet.nivel = Math.max(1, Number(pet.nivel) || 1);
  pet.xpMax = Math.max(1, Number(pet.xpMax) || pet.nivel * 50);
  let niveis = 0;
  while (pet.xp >= pet.xpMax) {
    pet.xp -= pet.xpMax;
    pet.nivel++;
    pet.vidaMax = (Number(pet.vidaMax) || 50) + 8;
    pet.ataque = (Number(pet.ataque) || 1) + 2;
    pet.defesa = (Number(pet.defesa) || 0) + 1;
    pet.vida = pet.vidaMax;
    pet.xpMax = pet.nivel * 50;
    niveis++;
  }
  return { subiuNivel: niveis > 0, niveis };
}

function brincarPet(pet) {
  pet.carinho = Math.min(100, (pet.carinho || 50) + 20);
  pet.felicidade = Math.min(100, (pet.felicidade || 50) + 15);
  pet.energia = Math.max(0, (pet.energia || 0) - 15);
  return ganharXpPet(pet, 5);
}

function treinarPet(pet) {
  pet.ataque += 1;
  pet.defesa += 1;
  pet.energia = Math.max(0, (pet.energia || 0) - 25);
  return ganharXpPet(pet, 10);
}

// ============================================================
// LOJA RPG
// ============================================================

const LOJA_RPG = [
  { id: "espada", nome: "⚔️ Espada de Ferro", preco: 50, ataque: 5 },
  { id: "escudo", nome: "🛡️ Escudo de Madeira", preco: 50, defesa: 5 },
  { id: "armadura", nome: "🥋 Armadura Élfica", preco: 100, defesa: 10 },
  { id: "varinha", nome: "🪄 Varinha Arcana", preco: 100, ataque: 10 },
  { id: "pocao", nome: "🧪 Poção de Vida (cura tudo)", preco: 30, cura: true },
  { id: "pocao_pet", nome: "🦴 Ração para Pet", preco: 25, curaPet: true },
  { id: "amuleto", nome: "🔮 Amuleto do Poder", preco: 200, ataque: 15, defesa: 5 },
  { id: "capa", nome: "🧥 Capa Mística", preco: 150, defesa: 12 },
  { id: "anel", nome: "💍 Anel da Força", preco: 300, ataque: 20, defesa: 10 },
];

// ============================================================
// FUNÇÕES DE PERSONAGEM
// ============================================================

function criarPersonagem(nomeJogador, classeId) {
  const base = CLASSES_RPG[classeId];
  return {
    nome: nomeJogador,
    classe: classeId,
    classeNome: base.nome,
    emoji: base.emoji,
    nivel: 1,
    xp: 0,
    xpMax: 100,
    vida: base.vidaMax,
    vidaMax: base.vidaMax,
    ataque: base.ataque,
    defesa: base.defesa,
    mana: 50,
    manaMax: 50,
    ouro: 20,
    pet: null,
  };
}

function sortearMonstro(nivel) {
  const indiceMax = Math.min(MONSTROS.length - 1, Math.floor(nivel / 2) + 1);
  const candidatos = MONSTROS.slice(0, indiceMax + 1);
  return { ...candidatos[Math.floor(Math.random() * candidatos.length)] };
}

// ============================================================
// BATALHA POR GOLPES (turnos com poderes)
// ============================================================

function iniciarBatalhaGolpes(personagem, monstro) {
  const estado = {
    vidaJogador: personagem.vida,
    vidaMonstro: monstro.vida,
    mana: personagem.mana || 50,
    defesaBuff: 0,
    log: [],
    rodada: 0,
    venceu: false,
    perdeu: false,
  };
  return estado;
}

function executarGolpe(estado, personagem, monstro, poderId) {
  const poderes = CLASSES_RPG[personagem.classe]?.poderes || [];
  const poder = poderes.find((p) => p.id === poderId);
  if (!poder) return { erro: "Poder não encontrado" };

  if (estado.mana < (poder.custo || 0)) {
    return { erro: "Mana insuficiente" };
  }

  estado.mana -= (poder.custo || 0);
  estado.rodada++;
  const log = [];

  // Ação do jogador
  if (poder.tipo === "ataque") {
    const danoBase = personagem.ataque * poder.dano;
    const danoFinal = Math.max(1, Math.floor(danoBase - monstro.defesa * 0.5 + Math.random() * 5));
    const critico = Math.random() < 0.15;
    const danoTotal = critico ? Math.floor(danoFinal * 1.5) : danoFinal;
    estado.vidaMonstro -= danoTotal;
    log.push(`${poder.emoji} ${poder.nome} causou ${danoTotal} de dano${critico ? " (CRÍTICO!)" : ""}!`);
  } else if (poder.tipo === "defesa") {
    estado.defesaBuff = (poder.bonus || 5);
    log.push(`${poder.emoji} ${poder.nome}! Defesa aumentada em ${estado.defesaBuff}.`);
  } else if (poder.tipo === "cura") {
    const cura = poder.cura || 20;
    estado.vidaJogador = Math.min(personagem.vidaMax, estado.vidaJogador + cura);
    log.push(`${poder.emoji} ${poder.nome} curou ${cura} de vida!`);
  }

  if (estado.vidaMonstro <= 0) {
    estado.venceu = true;
    log.push(`🎉 ${monstro.nome} foi derrotado!`);
    return { log, estado, venceu: true };
  }

  // Ação do monstro
  const poderMonstro = monstro.poderes[Math.floor(Math.random() * monstro.poderes.length)];
  const danoMonstro = Math.max(1, Math.floor(monstro.ataque * poderMonstro.dano - (personagem.defesa + estado.defesaBuff) * 0.5 + Math.random() * 4));
  estado.vidaJogador -= danoMonstro;
  log.push(`${monstro.emoji} ${monstro.nome} usou ${poderMonstro.nome} e causou ${danoMonstro} de dano!`);

  if (estado.vidaJogador <= 0) {
    estado.perdeu = true;
    log.push(`💀 Você foi derrotado...`);
    return { log, estado, perdeu: true };
  }

  // Regen de mana
  estado.mana = Math.min(personagem.manaMax || 50, estado.mana + 5);
  estado.defesaBuff = 0; // Reset buff

  return { log, estado };
}

// ============================================================
// BATALHA ENTRE DOIS MEMBROS
// ============================================================

function batalharMembros(personagem1, personagem2) {
  const vida1 = personagem1.vida || 100;
  const vida2 = personagem2.vida || 100;
  const atq1 = personagem1.ataque || 15;
  const atq2 = personagem2.ataque || 15;
  const def1 = personagem1.defesa || 10;
  const def2 = personagem2.defesa || 10;

  let v1 = vida1;
  let v2 = vida2;
  const log = [];
  let rodada = 0;

  while (v1 > 0 && v2 > 0 && rodada < 15) {
    rodada++;
    // Jogador 1 ataca
    const dano1 = Math.max(1, Math.floor(atq1 - def2 * 0.4 + Math.random() * 6 - 2));
    v2 -= dano1;
    log.push(`⚔️ ${personagem1.nome || "Jogador 1"} causou ${dano1} de dano!`);
    if (v2 <= 0) break;

    // Jogador 2 ataca
    const dano2 = Math.max(1, Math.floor(atq2 - def1 * 0.4 + Math.random() * 6 - 2));
    v1 -= dano2;
    log.push(`${personagem2.emoji || "🗡️"} ${personagem2.nome || "Jogador 2"} causou ${dano2} de dano!`);
  }

  return {
    vencedor: v1 > 0 ? personagem1 : personagem2,
    log,
    vidaFinal1: Math.max(0, v1),
    vidaFinal2: Math.max(0, v2),
  };
}

// ============================================================
// BATALHA ENTRE MONSTROS
// ============================================================

function batalharMonstros(monstro1, monstro2) {
  let v1 = monstro1.vida;
  let v2 = monstro2.vida;
  const log = [];
  let rodada = 0;

  while (v1 > 0 && v2 > 0 && rodada < 12) {
    rodada++;
    // Monstro 1 ataca
    const poder1 = monstro1.poderes[Math.floor(Math.random() * monstro1.poderes.length)];
    const dano1 = Math.max(1, Math.floor(monstro1.ataque * poder1.dano - monstro2.defesa * 0.4 + Math.random() * 5 - 2));
    v2 -= dano1;
    log.push(`${monstro1.emoji} ${monstro1.nome} usou ${poder1.nome} (${dano1} de dano)!`);
    if (v2 <= 0) break;

    // Monstro 2 ataca
    const poder2 = monstro2.poderes[Math.floor(Math.random() * monstro2.poderes.length)];
    const dano2 = Math.max(1, Math.floor(monstro2.ataque * poder2.dano - monstro1.defesa * 0.4 + Math.random() * 5 - 2));
    v1 -= dano2;
    log.push(`${monstro2.emoji} ${monstro2.nome} usou ${poder2.nome} (${dano2} de dano)!`);
  }

  return {
    vencedor: v1 > 0 ? monstro1 : monstro2,
    log,
  };
}

// ============================================================
// BATALHA DINÂMICA COM BOTÕES
// ============================================================

const batalhasDinamicas = {}; // por chat+user

function iniciarBatalhaDinamica(chatId, userJid, personagem, monstro) {
  const chave = `${chatId}:${userJid}`;
  batalhasDinamicas[chave] = {
    personagem,
    monstro,
    vidaJogador: personagem.vida,
    vidaMonstro: monstro.vida,
    mana: personagem.mana || 50,
    manaMax: personagem.manaMax || 50,
    defesaBuff: 0,
    rodada: 0,
    log: [],
    ativo: true,
  };
  return batalhasDinamicas[chave];
}

function obterBatalhaDinamica(chatId, userJid) {
  return batalhasDinamicas[`${chatId}:${userJid}`];
}

function encerrarBatalhaDinamica(chatId, userJid) {
  delete batalhasDinamicas[`${chatId}:${userJid}`];
}

function acaoBatalhaDinamica(chatId, userJid, acao) {
  const estado = batalhasDinamicas[`${chatId}:${userJid}`];
  if (!estado || !estado.ativo) return { erro: "Nenhuma batalha ativa" };

  const personagem = estado.personagem;
  const monstro = estado.monstro;
  const poderes = CLASSES_RPG[personagem.classe]?.poderes || [];
  const poder = poderes.find((p) => p.id === acao);

  if (!poder) return { erro: "Ação inválida" };
  if (estado.mana < (poder.custo || 0)) return { erro: "Mana insuficiente" };

  estado.mana -= (poder.custo || 0);
  estado.rodada++;
  const log = [];

  // Ação do jogador
  if (poder.tipo === "ataque") {
    const danoBase = personagem.ataque * poder.dano;
    const danoFinal = Math.max(1, Math.floor(danoBase - monstro.defesa * 0.5 + Math.random() * 5));
    const critico = Math.random() < 0.15;
    const danoTotal = critico ? Math.floor(danoFinal * 1.5) : danoFinal;
    estado.vidaMonstro -= danoTotal;
    log.push(`${poder.emoji} ${poder.nome} causou ${danoTotal} de dano${critico ? " (CRÍTICO!)" : ""}!`);
  } else if (poder.tipo === "defesa") {
    estado.defesaBuff = (poder.bonus || 5);
    log.push(`${poder.emoji} ${poder.nome}! Defesa +${estado.defesaBuff}.`);
  } else if (poder.tipo === "cura") {
    const cura = poder.cura || 20;
    estado.vidaJogador = Math.min(personagem.vidaMax, estado.vidaJogador + cura);
    log.push(`${poder.emoji} ${poder.nome} curou ${cura} HP!`);
  }

  if (estado.vidaMonstro <= 0) {
    estado.ativo = false;
    log.push(`🎉 ${monstro.nome} foi derrotado!`);
    return { log, estado, venceu: true };
  }

  // Ação do monstro
  const poderMonstro = monstro.poderes[Math.floor(Math.random() * monstro.poderes.length)];
  const danoMonstro = Math.max(1, Math.floor(monstro.ataque * poderMonstro.dano - (personagem.defesa + estado.defesaBuff) * 0.5 + Math.random() * 4));
  estado.vidaJogador -= danoMonstro;
  log.push(`${monstro.emoji} ${monstro.nome} usou ${poderMonstro.nome} (${danoMonstro} de dano)!`);

  if (estado.vidaJogador <= 0) {
    estado.ativo = false;
    log.push(`💀 Você foi derrotado...`);
    return { log, estado, perdeu: true };
  }

  estado.mana = Math.min(estado.manaMax, estado.mana + 5);
  estado.defesaBuff = 0;

  return { log, estado };
}

// ============================================================
// XP E NÍVEL
// ============================================================

function ganharXp(personagem, quantidade) {
  personagem.xp += quantidade;
  let subiuNivel = false;
  while (personagem.xp >= personagem.xpMax) {
    personagem.xp -= personagem.xpMax;
    personagem.nivel += 1;
    personagem.vidaMax += 10;
    personagem.ataque += 2;
    personagem.defesa += 1;
    personagem.vida = personagem.vidaMax;
    personagem.xpMax = personagem.nivel * 100;
    personagem.manaMax = (personagem.manaMax || 50) + 10;
    personagem.mana = personagem.manaMax;
    subiuNivel = true;
  }
  return subiuNivel;
}

// Batalha simples antiga (mantida para compatibilidade)
function batalhar(personagem, monstro) {
  let vidaJogador = personagem.vida;
  let vidaMonstro = monstro.vida;
  const log = [];
  let rodada = 0;

  while (vidaJogador > 0 && vidaMonstro > 0 && rodada < 15) {
    rodada++;
    const danoJogador = Math.max(1, personagem.ataque - monstro.defesa + Math.floor(Math.random() * 6) - 2);
    vidaMonstro -= danoJogador;
    log.push(`⚔️ Você causou ${danoJogador} de dano em ${monstro.nome}!`);
    if (vidaMonstro <= 0) break;

    const danoMonstro = Math.max(1, monstro.ataque - personagem.defesa + Math.floor(Math.random() * 5) - 2);
    vidaJogador -= danoMonstro;
    log.push(`${monstro.emoji} ${monstro.nome} causou ${danoMonstro} de dano em você!`);
  }

  const venceu = vidaMonstro <= 0;
  return {
    venceu,
    log,
    vidaFinalJogador: Math.max(0, vidaJogador),
  };
}

module.exports = {
  CLASSES_RPG,
  MONSTROS,
  LOJA_RPG,
  PETS_DISPONIVEIS,
  PET_PODERES,
  criarPersonagem,
  criarPet,
  cuidarPet,
  alimentarPet,
  curarPet,
  brincarPet,
  treinarPet,
  ganharXpPet,
  sortearMonstro,
  batalhar,
  ganharXp,
  iniciarBatalhaGolpes,
  executarGolpe,
  batalharMembros,
  batalharMonstros,
  iniciarBatalhaDinamica,
  obterBatalhaDinamica,
  encerrarBatalhaDinamica,
  acaoBatalhaDinamica,
};
