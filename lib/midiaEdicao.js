/**
 * Edições extras de mídia usando ffmpeg (precisa: pkg install ffmpeg).
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");

function rodarFfmpeg(bufferEntrada, nomeEntrada, args, nomeSaida) {
  return new Promise((resolve, reject) => {
    const pastaTmp = fs.mkdtempSync(path.join(os.tmpdir(), "edicao-"));
    const entrada = path.join(pastaTmp, nomeEntrada);
    const saida = path.join(pastaTmp, nomeSaida);
    fs.writeFileSync(entrada, bufferEntrada);

    execFile("ffmpeg", ["-i", entrada, ...args, saida], (erro) => {
      const limpar = () => fs.rmSync(pastaTmp, { recursive: true, force: true });
      if (erro) {
        limpar();
        return reject(erro);
      }
      const bufferSaida = fs.readFileSync(saida);
      limpar();
      resolve(bufferSaida);
    });
  });
}

// Converte uma figurinha (webp) de volta pra imagem (png)
function figurinhaParaImagem(bufferWebp) {
  return rodarFfmpeg(bufferWebp, "in.webp", [], "out.png");
}

// Deixa uma imagem em preto e branco
function pretoEBranco(bufferImagem, ehVideo) {
  return rodarFfmpeg(bufferImagem, ehVideo ? "in.mp4" : "in.jpg", ["-vf", "hue=s=0"], ehVideo ? "out.mp4" : "out.jpg");
}

// Espelha uma imagem/vídeo horizontalmente
function espelhar(bufferImagem, ehVideo) {
  return rodarFfmpeg(bufferImagem, ehVideo ? "in.mp4" : "in.jpg", ["-vf", "hflip"], ehVideo ? "out.mp4" : "out.jpg");
}

// Extrai o áudio de um vídeo
function extrairAudio(bufferVideo) {
  return rodarFfmpeg(bufferVideo, "in.mp4", ["-vn", "-acodec", "aac"], "out.m4a");
}

module.exports = { figurinhaParaImagem, pretoEBranco, espelhar, extrairAudio };
