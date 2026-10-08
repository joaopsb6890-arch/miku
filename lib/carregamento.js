/**
 * Simula uma "tela de carregamento animada": manda uma mensagem e vai
 * editando o texto dela em frames sucessivos (usando o recurso de editar
 * mensagens do WhatsApp), dando a sensação de um spinner/progresso.
 */

async function animarCarregamento(sock, from, textoBase, passos = 3, atraso = 450) {
  try {
    const primeira = await sock.sendMessage(from, { text: `${textoBase}.` });
    const key = primeira?.key;
    if (!key) return null;

    for (let i = 2; i <= passos; i++) {
      await new Promise((r) => setTimeout(r, atraso));
      await sock.sendMessage(from, { text: `${textoBase}${".".repeat(i)}`, edit: key });
    }
    return key;
  } catch (erro) {
    // Se o edit falhar por qualquer motivo (versão do WhatsApp, etc), não trava o comando
    console.error("Erro na animação de carregamento:", erro);
    return null;
  }
}

module.exports = { animarCarregamento };
