/**
 * Sistema de XP, nível e moedas.
 */

const { pegarUsuario, salvar } = require("./db");

// Quanto de XP é necessário para alcançar um certo nível
function xpParaNivel(nivel) {
  return nivel * 150;
}

// Dá XP e moedas por mensagem enviada, e sobe de nível se atingir o limite
function darXpPorMensagem(jid, nome) {
  const usuario = pegarUsuario(jid, nome);
  usuario.mensagens += 1;
  usuario.xp += Math.floor(Math.random() * 8) + 3; // entre 3 e 10 xp por mensagem
  usuario.moedas += Math.floor(Math.random() * 2) + 1; // entre 1 e 2 moedas por mensagem

  let subiuNivel = false;
  while (usuario.xp >= xpParaNivel(usuario.nivel)) {
    usuario.xp -= xpParaNivel(usuario.nivel);
    usuario.nivel += 1;
    usuario.moedas += 20; // bônus de moedas ao subir de nível
    subiuNivel = true;
  }

  salvar();
  return { usuario, subiuNivel };
}

module.exports = { xpParaNivel, darXpPorMensagem };
