/**
 * Escolhe um arquivo aleatório da pasta /images (gif, mp4, jpg, png, webp)
 * pra mandar junto do menu. Se a pasta estiver vazia, manda só o texto.
 */

const fs = require("fs");
const path = require("path");

const PASTA_IMAGENS = path.join(__dirname, "..", "images");

function pegarMidiaAleatoria() {
  if (!fs.existsSync(PASTA_IMAGENS)) {
    fs.mkdirSync(PASTA_IMAGENS, { recursive: true });
    return null;
  }
  const arquivos = fs
    .readdirSync(PASTA_IMAGENS)
    .filter((f) => /\.(gif|mp4|jpg|jpeg|png|webp)$/i.test(f));
  if (arquivos.length === 0) return null;
  const escolhido = arquivos[Math.floor(Math.random() * arquivos.length)];
  return path.join(PASTA_IMAGENS, escolhido);
}

// Manda o texto do menu, com uma mídia aleatória da pasta /images se houver alguma
async function enviarComMidiaAleatoria(sock, from, texto) {
  const caminho = pegarMidiaAleatoria();
  if (!caminho) {
    return sock.sendMessage(from, { text: texto });
  }

  const buffer = fs.readFileSync(caminho);
  const ext = path.extname(caminho).toLowerCase();

  if (ext === ".gif" || ext === ".mp4") {
    return sock.sendMessage(from, { video: buffer, gifPlayback: true, caption: texto });
  }
  return sock.sendMessage(from, { image: buffer, caption: texto });
}

module.exports = { enviarComMidiaAleatoria };
