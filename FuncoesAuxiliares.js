const movimentosPossiveis = ["F", "F'", "F2","B", "B'", "B2",
                             "L", "L'", "L2","R", "R'", "R2",
                             "U", "U'", "U2","D", "D'", "D2"];

function gerarEstados(movimentosAnteriores) {

    const estadosGerados = movimentosPossiveis.map(movimento => {
        const sequencia = `${movimentosAnteriores.trim()} ${movimento}`.trim();
        return sequencia;
    });

    return estadosGerados;
}

module.exports = { gerarEstados };
