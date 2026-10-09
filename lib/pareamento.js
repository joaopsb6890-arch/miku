function normalizarNumeroTelefone(valor) {
  const numero = String(valor || "").trim().replace(/^00/, "").replace(/[^\d]/g, "");
  if (numero.length < 8 || numero.length > 15) {
    throw new Error("PAIRING_NUMBER deve incluir o indicativo do país e ter entre 8 e 15 dígitos.");
  }
  return numero;
}

module.exports = { normalizarNumeroTelefone };
