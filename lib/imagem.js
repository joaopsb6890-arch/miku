/**
 * Geração de imagens com Jimp — 100% JavaScript, sem dependências nativas.
 * Suporta foto de perfil personalizada do usuário.
 */

const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const PASTA_PERFIS = path.join(__dirname, "..", "data", "perfis");
const cacheFontes = new Map();

function limparParaImagem(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function textoCurto(texto, limite = 36) {
  const limpo = limparParaImagem(texto);
  return limpo.length > limite ? `${limpo.slice(0, limite - 1)}…` : limpo;
}

async function carregarFontes() {
  const [titulo, texto, pequeno] = await Promise.all([
    carregarFonte(Jimp.FONT_SANS_32_WHITE),
    carregarFonte(Jimp.FONT_SANS_16_WHITE),
    carregarFonte(Jimp.FONT_SANS_16_WHITE),
  ]);
  return { titulo, texto, pequeno };
}

function carregarFonte(uri) {
  if (!cacheFontes.has(uri)) cacheFontes.set(uri, Jimp.loadFont(uri));
  return cacheFontes.get(uri);
}

// Garante que a pasta de perfis existe
function garantirPastaPerfis() {
  if (!fs.existsSync(PASTA_PERFIS)) {
    fs.mkdirSync(PASTA_PERFIS, { recursive: true });
  }
}

// Salva a foto de perfil personalizada do usuário
function salvarFotoPerfil(jid, buffer) {
  garantirPastaPerfis();
  const caminho = path.join(PASTA_PERFIS, `${jid}.jpg`);
  fs.writeFileSync(caminho, buffer);
  return caminho;
}

// Carrega a foto de perfil personalizada (se existir)
function carregarFotoPerfil(jid) {
  const caminho = path.join(PASTA_PERFIS, `${jid}.jpg`);
  if (fs.existsSync(caminho)) {
    return fs.readFileSync(caminho);
  }
  return null;
}

// Remove a foto de perfil personalizada
function removerFotoPerfil(jid) {
  const caminho = path.join(PASTA_PERFIS, `${jid}.jpg`);
  if (fs.existsSync(caminho)) {
    fs.unlinkSync(caminho);
    return true;
  }
  return false;
}

// Gera imagem de placar (futebol, basquete, etc)
async function gerarImagemPlacar({ tituloTopo, timeA, timeB, golsA, golsB, corFundo = 0x0f172aff }) {
  const largura = 720;
  const altura = 360;
  const imagem = await Jimp.create(largura, altura, corFundo);

  const fonteTopo = await carregarFonte(Jimp.FONT_SANS_32_WHITE);
  const fontePlacar = await carregarFonte(Jimp.FONT_SANS_64_WHITE);
  const fonteTimes = await carregarFonte(Jimp.FONT_SANS_16_WHITE);

  imagem.composite(await Jimp.create(largura, 12, 0x55d6beff), 0, 0);
  imagem.composite(await Jimp.create(460, 116, 0x141f30ff), 130, 108);
  imagem.composite(await Jimp.create(300, 2, 0x334155ff), 48, 266);
  imagem.composite(await Jimp.create(300, 2, 0x334155ff), 372, 266);
  imagem.print(fonteTopo, 0, 28, { text: textoCurto(tituloTopo || "PLACAR", 34).toUpperCase(), alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, largura);
  imagem.print(fontePlacar, 130, 124, { text: `${golsA}  x  ${golsB}`, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, 460);
  imagem.print(fonteTimes, 48, 282, { text: textoCurto(timeA || "Time A", 28), alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT }, 300);
  imagem.print(fonteTimes, 372, 282, { text: textoCurto(timeB || "Time B", 28), alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT }, 300);

  return imagem.getBufferAsync(Jimp.MIME_PNG);
}

// Gera imagem do shipp
async function gerarImagemShipp({ urlFoto1, urlFoto2, nome1, nome2, porcentagem }) {
  const tamanhoFoto = 210;
  const largura = 720;
  const altura = 420;
  const tela = await Jimp.create(largura, altura, 0x0b1220ff);

  async function carregarFoto(url) {
    try {
      const img = await Jimp.read(url);
      return img.cover(tamanhoFoto, tamanhoFoto);
    } catch {
      return Jimp.create(tamanhoFoto, tamanhoFoto, 0x26364aff);
    }
  }

  const [foto1, foto2] = await Promise.all([carregarFoto(urlFoto1), carregarFoto(urlFoto2)]);
  tela.composite(await Jimp.create(largura, 12, 0xec4899ff), 0, 0);
  tela.composite(await Jimp.create(tamanhoFoto + 12, tamanhoFoto + 12, 0xec4899ff), 54, 58);
  tela.composite(await Jimp.create(tamanhoFoto + 12, tamanhoFoto + 12, 0xec4899ff), largura - tamanhoFoto - 66, 58);
  tela.composite(foto1, 60, 64);
  tela.composite(foto2, largura - tamanhoFoto - 60, 64);
  const fontePorcentagem = await carregarFonte(Jimp.FONT_SANS_64_WHITE);
  const fonteTitulo = await carregarFonte(Jimp.FONT_SANS_32_WHITE);
  const fonteNomes = await carregarFonte(Jimp.FONT_SANS_16_WHITE);
  const compatibilidade = Math.max(0, Math.min(100, Number(porcentagem) || 0));
  tela.print(fonteNomes, 0, 28, {
    text: "SINTONIA  /  CONEXAO",
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, largura);
  tela.print(fonteTitulo, largura / 2 - 30, 142, {
    text: "+",
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, 60);
  tela.composite(await Jimp.create(188, 2, 0x334155ff), 42, 310);
  tela.composite(await Jimp.create(188, 2, 0x334155ff), largura - 230, 310);
  tela.print(fontePorcentagem, 0, 286, { text: `${compatibilidade}%`, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, largura);
  tela.print(fonteNomes, 60, 366, {
    text: textoCurto(nome1 || "Pessoa 1", 24),
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, tamanhoFoto);
  tela.print(fonteNomes, largura - tamanhoFoto - 60, 366, {
    text: textoCurto(nome2 || "Pessoa 2", 24),
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, tamanhoFoto);

  return tela.getBufferAsync(Jimp.MIME_PNG);
}

// Gera o tabuleiro do TERMO
async function gerarImagemTermo(historico) {
  const tamanhoCelula = 64;
  const margem = 8;
  const colunas = historico[0]?.length || 5;
  const largura = colunas * (tamanhoCelula + margem) + margem;
  const altura = historico.length * (tamanhoCelula + margem) + margem;

  const tela = await Jimp.create(largura, altura, 0x1e293bff);
  const fonte = await carregarFonte(Jimp.FONT_SANS_32_WHITE);
  const cores = { verde: 0x22c55eff, amarelo: 0xeab308ff, cinza: 0x334155ff };

  for (let i = 0; i < historico.length; i++) {
    for (let j = 0; j < historico[i].length; j++) {
      const celula = historico[i][j];
      const x = margem + j * (tamanhoCelula + margem);
      const y = margem + i * (tamanhoCelula + margem);
      const cor = cores[celula.cor] || cores.cinza;
      tela.scan(x, y, tamanhoCelula, tamanhoCelula, function (_x, _y, idx) {
        this.bitmap.data.writeUInt32BE(cor, idx);
      });
      tela.print(fonte, x, y + (tamanhoCelula - 32) / 2, { text: limparParaImagem(celula.letra).toUpperCase() || "?", alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, tamanhoCelula);
    }
  }

  return tela.getBufferAsync(Jimp.MIME_PNG);
}

async function gerarImagemBoasVindas({ nome, grupo }) {
  const largura = 900;
  const altura = 480;
  const tela = await Jimp.create(largura, altura, 0x0b1020ff);
  const { titulo, texto, pequeno } = await carregarFontes();
  const fonteMarca = await carregarFonte(Jimp.FONT_SANS_64_WHITE);

  tela.composite(await Jimp.create(largura, 14, 0x55d6beff), 0, 0);
  tela.composite(await Jimp.create(250, 300, 0x152b3cff), largura - 250, 110);
  tela.composite(await Jimp.create(largura - 96, 2, 0x24334aff), 48, 392);
  tela.composite(await Jimp.create(12, 94, 0x55d6beff), 48, 112);
  const centroX = 775;
  const centroY = 228;
  tela.scan(centroX - 76, centroY - 76, 152, 152, function (x, y, idx) {
    const distancia = Math.hypot(x - centroX, y - centroY);
    if (distancia >= 66 && distancia <= 74) this.bitmap.data.writeUInt32BE(0x55d6beff, idx);
  });

  tela.print(pequeno, 78, 54, {
    text: "HATSUNE MIKU  /  COMUNIDADE",
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
  }, 700);
  tela.print(titulo, 78, 143, {
    text: "BEM-VINDO(A)!",
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
  }, 720);
  tela.print(texto, 80, 204, {
    text: textoCurto(nome || "Novo membro", 34),
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
  }, 700);
  tela.print(pequeno, 80, 250, {
    text: `Que bom ter voce aqui${grupo ? ` no ${textoCurto(grupo, 28)}` : ""}.`,
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
  }, 700);
  tela.print(fonteMarca, centroX - 76, centroY - 42, {
    text: "M",
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, 152);
  tela.print(pequeno, 662, 336, {
    text: "MUSICA  /  JOGOS  /  AMIZADE",
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, 226);
  tela.print(pequeno, 78, 418, {
    text: "Leia as regras e fique a vontade para conversar.",
    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
  }, 740);

  return tela.getBufferAsync(Jimp.MIME_PNG);
}

async function gerarImagemPet(pet) {
  const largura = 900;
  const altura = 500;
  const tela = await Jimp.create(largura, altura, 0x101827ff);
  const { titulo, texto, pequeno } = await carregarFontes();
  const nivel = Math.max(1, Number(pet.nivel) || 1);
  const xpMax = Math.max(1, Number(pet.xpMax) || 50);

  tela.composite(await Jimp.create(largura, 12, 0xf6b84aff), 0, 0);
  tela.composite(await Jimp.create(4, 270, 0xf6b84aff), 48, 48);
  tela.composite(await Jimp.create(800, 2, 0x334155ff), 50, 160);
  tela.print(pequeno, 74, 50, { text: `COMPANHEIRO  /  ${textoCurto(pet.tipo, 20).toUpperCase()}` }, 700);
  tela.print(titulo, 74, 82, { text: textoCurto(pet.nome, 30) }, 700);
  tela.print(texto, 74, 124, { text: `NIVEL ${nivel}     XP ${Math.max(0, Number(pet.xp) || 0)}/${xpMax}` }, 700);

  const desenharBarra = async (rotulo, valor, maximo, x, y, cor) => {
    const larguraBarra = 344;
    const alturaBarra = 16;
    const proporcao = Math.max(0, Math.min(1, (Number(valor) || 0) / Math.max(1, maximo)));
    tela.print(pequeno, x, y, { text: textoCurto(rotulo, 24) }, larguraBarra);
    tela.composite(await Jimp.create(larguraBarra, alturaBarra, 0x334155ff), x, y + 22);
    if (proporcao > 0) {
      tela.composite(await Jimp.create(Math.max(2, Math.round(larguraBarra * proporcao)), alturaBarra, cor), x, y + 22);
    }
    tela.print(pequeno, x, y + 42, {
      text: `${Math.round(Math.max(0, Math.min(maximo, Number(valor) || 0)))}/${maximo}`,
    }, larguraBarra);
  };

  await desenharBarra("VIDA", pet.vida, pet.vidaMax, 74, 196, 0xef6675ff);
  await desenharBarra("FOME SACIADA", 100 - pet.fome, 100, 480, 196, 0xf6b84aff);
  await desenharBarra("ENERGIA", pet.energia, 100, 74, 294, 0x56c8a8ff);
  await desenharBarra("FELICIDADE", pet.felicidade, 100, 480, 294, 0x82aaffff);

  tela.composite(await Jimp.create(800, 2, 0x334155ff), 50, 418);
  tela.print(pequeno, 74, 440, {
    text: `ATAQUE ${Math.max(0, Number(pet.ataque) || 0)}     DEFESA ${Math.max(0, Number(pet.defesa) || 0)}     CARINHO ${Math.round(Math.max(0, Math.min(100, Number(pet.carinho) || 0)))}%`,
  }, 760);
  return tela.getBufferAsync(Jimp.MIME_PNG);
}

// Gera a carta de personagem do RPG
async function gerarImagemRPG({ nome, classeEmoji, nivel, vida, vidaMax, ataque, defesa, ouro, corFundo = 0x1e1b2eff }) {
  const largura = 900;
  const altura = 420;
  const imagem = await Jimp.create(largura, altura, corFundo);

  const { titulo: fonteTitulo, texto: fonteTexto, pequeno: fontePequena } = await carregarFontes();
  const nivelSeguro = Math.max(1, Number(nivel) || 1);
  const vidaMaxima = Math.max(1, Number(vidaMax) || 1);
  const vidaAtual = Math.max(0, Math.min(vidaMaxima, Number(vida) || 0));
  const proporcao = vidaAtual / vidaMaxima;
  const barraLargura = 780;
  const barraX = 60;
  const barraY = 190;

  imagem.composite(await Jimp.create(largura, 12, 0x8b7cf6ff), 0, 0);
  imagem.print(fontePequena, 60, 46, { text: "AVENTURA RPG  /  PERSONAGEM" }, 780);
  imagem.print(fonteTitulo, 60, 78, {
    text: textoCurto(`${nome || "Aventureiro"}  •  NÍVEL ${nivelSeguro}`, 40),
  }, 780);
  imagem.composite(await Jimp.create(780, 118, 0x141f30ff), 60, 142);
  imagem.print(fontePequena, 86, 158, { text: "PONTOS DE VIDA" }, 730);
  imagem.composite(await Jimp.create(barraLargura, 24, 0x334155ff), barraX, barraY);
  if (proporcao > 0) {
    const larguraPreenchida = Math.max(2, Math.round(barraLargura * proporcao));
    const corVida = proporcao > 0.5 ? 0x22c55eff : proporcao > 0.2 ? 0xeab308ff : 0xef4444ff;
    imagem.composite(await Jimp.create(larguraPreenchida, 24, corVida), barraX, barraY);
  }
  imagem.print(fonteTexto, 86, 222, { text: `${vidaAtual}/${vidaMaxima} HP` }, 730);

  const atributos = [
    ["ATAQUE", Math.max(0, Number(ataque) || 0)],
    ["DEFESA", Math.max(0, Number(defesa) || 0)],
    ["OURO", Math.max(0, Number(ouro) || 0)],
  ];
  for (let indice = 0; indice < atributos.length; indice++) {
    const x = 60 + indice * 270;
    imagem.composite(await Jimp.create(250, 74, 0x141f30ff), x, 292);
    imagem.print(fontePequena, x + 16, 304, { text: atributos[indice][0] }, 220);
    imagem.print(fonteTitulo, x + 16, 326, { text: String(atributos[indice][1]) }, 220);
  }

  return imagem.getBufferAsync(Jimp.MIME_PNG);
}

async function gerarImagemPerfil({ nome, titulo, nivel, xp, xpMax, moedas, bio, relacionamento, corMoldura, fotoPerfil, pet, rpg, idade, cidade, status, mensagens }) {
  const largura = 900;
  const altura = 580;
  const imagem = await Jimp.create(largura, altura, 0x0b1220ff);
  const cor = corMoldura || 0x55d6beff;
  const { titulo: fonteTitulo, texto: fonteTexto, pequeno: fontePequena } = await carregarFontes();

  imagem.composite(await Jimp.create(largura, 12, cor), 0, 0);
  imagem.composite(await Jimp.create(810, 2, 0x26364aff), 46, 190);
  imagem.composite(await Jimp.create(810, 2, 0x26364aff), 46, 462);

  const tamanhoFoto = 132;
  const fotoX = 52;
  const fotoY = 40;
  const inicial = limparParaImagem(nome || "U").slice(0, 1).toUpperCase() || "U";
  imagem.composite(await Jimp.create(tamanhoFoto + 10, tamanhoFoto + 10, cor), fotoX - 5, fotoY - 5);
  if (fotoPerfil) {
    try {
      const foto = await Jimp.read(fotoPerfil);
      foto.cover(tamanhoFoto, tamanhoFoto);
      imagem.composite(foto, fotoX, fotoY);
    } catch {
      imagem.composite(await Jimp.create(tamanhoFoto, tamanhoFoto, 0x26364aff), fotoX, fotoY);
      imagem.print(fonteTitulo, fotoX, fotoY + 46, {
        text: inicial,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      }, tamanhoFoto);
    }
  } else {
    imagem.composite(await Jimp.create(tamanhoFoto, tamanhoFoto, 0x26364aff), fotoX, fotoY);
    imagem.print(fonteTitulo, fotoX, fotoY + 46, {
      text: inicial,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    }, tamanhoFoto);
  }

  imagem.print(fontePequena, 222, 50, { text: "PERFIL  /  NIVEL E COMUNIDADE" }, 630);
  imagem.print(fonteTitulo, 222, 80, { text: textoCurto(nome || "Usuario", 28) }, 630);
  if (titulo) imagem.print(fonteTexto, 224, 123, { text: textoCurto(titulo, 42) }, 620);
  if (status) imagem.print(fontePequena, 224, 151, { text: textoCurto(status, 62) }, 620);

  const barraX = 52;
  const barraY = 208;
  const barraLargura = 796;
  const xpAtual = Math.max(0, Number(xp) || 0);
  const xpNecessario = Math.max(1, Number(xpMax) || 1);
  const progresso = Math.max(0, Math.min(1, xpAtual / xpNecessario));
  imagem.print(fontePequena, barraX, barraY, { text: `NIVEL ${Math.max(1, Number(nivel) || 1)}  /  XP ${xpAtual}/${xpNecessario}` }, barraLargura);
  imagem.composite(await Jimp.create(barraLargura, 16, 0x26364aff), barraX, barraY + 22);
  if (progresso > 0) {
    imagem.composite(await Jimp.create(Math.max(2, Math.round(barraLargura * progresso)), 16, 0x55d6beff), barraX, barraY + 22);
  }

  const detalhes = [
    [`MOEDAS`, `${Math.max(0, Number(moedas) || 0)}`],
    [`MENSAGENS`, `${Math.max(0, Number(mensagens) || 0)}`],
    [`IDADE / CIDADE`, [idade ? `${idade} anos` : null, cidade ? textoCurto(cidade, 22) : null].filter(Boolean).join(" · ") || "Nao definida"],
    [`RELACIONAMENTO`, relacionamento ? textoCurto(relacionamento, 34) : "Nao definido"],
    [`PET`, pet ? `${pet.emoji || ""} ${textoCurto(pet.nome, 20)}  /  NV ${pet.nivel || 1}` : "Ainda sem pet"],
    [`AVENTURA RPG`, rpg ? `${rpg.emoji || ""} ${textoCurto(rpg.classeNome || rpg.nome, 24)}  /  NV ${rpg.nivel || 1}` : "Ainda sem personagem"],
  ];
  const xPosicoes = [52, 466];
  const yPosicoes = [282, 345, 408];
  for (let indice = 0; indice < detalhes.length; indice++) {
    const [rotulo, valor] = detalhes[indice];
    const x = xPosicoes[indice % 2];
    const y = yPosicoes[Math.floor(indice / 2)];
    imagem.composite(await Jimp.create(382, 50, 0x141f30ff), x, y);
    imagem.print(fontePequena, x + 14, y + 7, { text: rotulo }, 350);
    imagem.print(fonteTexto, x + 14, y + 24, { text: textoCurto(valor, 38) }, 350);
  }

  imagem.print(fontePequena, 54, 484, { text: "BIO" }, 780);
  imagem.print(fonteTexto, 54, 508, {
    text: bio ? `"${textoCurto(bio, 90)}"` : "Adicione uma bio com !definirbio <texto>.",
  }, 790);
  return imagem.getBufferAsync(Jimp.MIME_PNG);
}

module.exports = {
  gerarImagemPlacar,
  gerarImagemShipp,
  gerarImagemTermo,
  gerarImagemRPG,
  gerarImagemPerfil,
  gerarImagemPet,
  gerarImagemBoasVindas,
  limparParaImagem,
  salvarFotoPerfil,
  carregarFotoPerfil,
  removerFotoPerfil,
};
