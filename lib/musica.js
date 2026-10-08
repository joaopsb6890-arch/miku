/**
 * Sistema de música otimizado — yt-dlp
 * Melhorias: busca de 1 resultado primeiro, timeout, filtro de duração,
 * paralelismo de downloads, cache simples.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");

// Cache LRU com limite de memória e deduplicação de pedidos simultâneos.
const cacheMusicas = new Map();
const downloadsEmAndamento = new Map();
const CACHE_MAX = 12;
const CACHE_MAX_BYTES = 60 * 1024 * 1024;
const CACHE_MAX_ITEM_BYTES = 8 * 1024 * 1024;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
let bytesEmCache = 0;

function executar(args, timeoutMs = 60000) {
  const argsCompletos = ["--no-warnings", "--no-call-home", ...args];
  return new Promise((resolve, reject) => {
    let temporizador;
    const child = execFile("yt-dlp", argsCompletos, { maxBuffer: 1024 * 1024 * 12 }, (erro, stdout, stderr) => {
      clearTimeout(temporizador);
      if (erro) return reject(new Error(stderr?.slice(0, 800) || erro.message));
      resolve(stdout);
    });
    temporizador = setTimeout(() => {
      if (!child.killed) {
        child.kill("SIGTERM");
        reject(new Error("Timeout: demorou demais para responder"));
      }
    }, timeoutMs);
  });
}

function formatarDuracao(segundos) {
  if (!segundos) return "";
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function buscarMusicas(termo, quantidade = 1) {
  // Busca apenas 1 resultado por padrão para ser mais rápido
  const saida = await executar([
    "--flat-playlist", "--dump-json", "--no-playlist",
    "--default-search", `ytsearch${quantidade}`, termo,
  ], 30000);
  const linhas = saida.trim().split("\n").filter(Boolean);
  return linhas.map((linha) => {
    const info = JSON.parse(linha);
    const raw = info.webpage_url || info.url || info.id;
    const url = raw && raw.startsWith("http") ? raw : `https://www.youtube.com/watch?v=${raw}`;
    return {
      titulo: info.title,
      url,
      duracao: formatarDuracao(info.duration),
    };
  });
}

async function baixarAudioBuffer(url) {
  const pastaTmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "musica-"));
  const saidaBase = path.join(pastaTmp, "audio");

  try {
    await executar([
      "-f", "bestaudio[ext=m4a]/bestaudio/best",
      "-x", "--audio-format", "m4a",
      "--audio-quality", "5",
      "--concurrent-fragments", "8",
      "--max-filesize", "15M",
      // Filtra músicas muito longas (max 15 min) — evita downloads gigantes
      "--match-filter", "duration < 900",
      "-o", `${saidaBase}.%(ext)s`,
      "--no-playlist",
      url,
    ], 120000);

    const arquivos = await fs.promises.readdir(pastaTmp);
    const arquivoGerado = arquivos.find((f) => f.startsWith("audio"));
    if (!arquivoGerado) throw new Error("yt-dlp não gerou o arquivo de áudio.");

    return await fs.promises.readFile(path.join(pastaTmp, arquivoGerado));
  } finally {
    await fs.promises.rm(pastaTmp, { recursive: true, force: true });
  }
}

function normalizarChave(termo) {
  return String(termo || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function retirarDoCache(chave) {
  const entrada = cacheMusicas.get(chave);
  if (!entrada) return;
  bytesEmCache = Math.max(0, bytesEmCache - entrada.buffer.length);
  cacheMusicas.delete(chave);
}

function guardarNoCache(chave, musica) {
  if (musica.buffer.length > CACHE_MAX_ITEM_BYTES) return;
  retirarDoCache(chave);
  cacheMusicas.set(chave, { ...musica, ts: Date.now() });
  bytesEmCache += musica.buffer.length;
  while (cacheMusicas.size > CACHE_MAX || bytesEmCache > CACHE_MAX_BYTES) {
    retirarDoCache(cacheMusicas.keys().next().value);
  }
}

// Busca e baixa em um passo; repetições compartilham o mesmo download.
async function buscarEBaixar(termo) {
  const chave = normalizarChave(termo);
  if (!chave) return null;
  const cached = cacheMusicas.get(chave);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    cacheMusicas.delete(chave);
    cacheMusicas.set(chave, cached);
    return { buffer: cached.buffer, titulo: cached.titulo, duracao: cached.duracao, fromCache: true };
  }
  if (cached) retirarDoCache(chave);
  if (downloadsEmAndamento.has(chave)) return downloadsEmAndamento.get(chave);

  const download = (async () => {
    const resultados = await buscarMusicas(termo, 1);
    if (resultados.length === 0) return null;

    const musica = resultados[0];
    const buffer = await baixarAudioBuffer(musica.url);
    const resultado = { buffer, titulo: musica.titulo, duracao: musica.duracao, fromCache: false };
    guardarNoCache(chave, resultado);
    return resultado;
  })();

  downloadsEmAndamento.set(chave, download);
  try {
    return await download;
  } finally {
    downloadsEmAndamento.delete(chave);
  }
}

function limparCacheMusicas() {
  cacheMusicas.clear();
  downloadsEmAndamento.clear();
  bytesEmCache = 0;
}

function aplicarEfeito(bufferEntrada, filtroFfmpeg) {
  return new Promise((resolve, reject) => {
    const pastaTmp = fs.mkdtempSync(path.join(os.tmpdir(), "efeito-"));
    const entrada = path.join(pastaTmp, "in.m4a");
    const saida = path.join(pastaTmp, "out.m4a");
    fs.writeFileSync(entrada, bufferEntrada);

    const child = execFile("ffmpeg", ["-i", entrada, "-af", filtroFfmpeg, saida], (erro) => {
      const limpar = () => fs.rmSync(pastaTmp, { recursive: true, force: true });
      if (erro) {
        limpar();
        return reject(erro);
      }
      const bufferSaida = fs.readFileSync(saida);
      limpar();
      resolve(bufferSaida);
    });
    setTimeout(() => {
      if (!child.killed) {
        child.kill("SIGTERM");
        reject(new Error("Timeout ao aplicar efeito"));
      }
    }, 30000);
  });
}

const aplicarBassBoost = (buffer) => aplicarEfeito(buffer, "bass=g=15,volume=1.3");
const aplicarNightcore = (buffer) => aplicarEfeito(buffer, "asetrate=44100*1.25,aresample=44100,atempo=1.06");
const aplicarSlowed = (buffer) => aplicarEfeito(buffer, "asetrate=44100*0.85,aresample=44100,atempo=1.0");
const aplicar8D = (buffer) => aplicarEfeito(buffer, "apulsator=hz=0.09");

module.exports = {
  buscarMusicas,
  baixarAudioBuffer,
  buscarEBaixar,
  normalizarChave,
  limparCacheMusicas,
  aplicarBassBoost,
  aplicarNightcore,
  aplicarSlowed,
  aplicar8D,
};
