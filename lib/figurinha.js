/**
 * Criação de figurinhas (imagem/vídeo -> webp) usando ffmpeg.
 * Precisa do ffmpeg instalado no sistema: pkg install ffmpeg (no Termux)
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

function converterParaWebp(bufferEntrada, ehVideo) {
  return new Promise((resolve, reject) => {
    const pastaTmp = fs.mkdtempSync(path.join(os.tmpdir(), "figurinha-"));
    const entrada = path.join(pastaTmp, ehVideo ? "in.mp4" : "in.jpg");
    const saida = path.join(pastaTmp, "out.webp");
    fs.writeFileSync(entrada, bufferEntrada);

    // "increase" faz a imagem crescer até COBRIR o quadrado todo (sem bordas),
    // e o "crop" corta o excesso no centro — resultado: sticker em tela cheia.
    const filtroBase = "scale=512:512:force_original_aspect_ratio=increase,crop=512:512";
    const args = ehVideo
      ? ["-i", entrada, "-t", "6", "-vf", `${filtroBase},fps=12`, "-loop", "0", "-an", "-vsync", "0", saida]
      : ["-i", entrada, "-vf", filtroBase, saida];

    execFile("ffmpeg", args, (erro) => {
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

// Recebe a mensagem que contém a mídia (pode ser a própria msg ou uma msg "reconstruída" de uma citação)
async function criarFigurinha(msgAlvo) {
  const buffer = await downloadMediaMessage(msgAlvo, "buffer", {});
  const ehVideo = !!msgAlvo.message?.videoMessage;
  return converterParaWebp(buffer, ehVideo);
}

module.exports = { criarFigurinha };
