const Cube = require('cubejs');
const funcoesAuxiliares = require('./FuncoesAuxiliares.js');

Cube.initSolver();

function buscaLargura(estadoInicial) {
    const fila = [[estadoInicial, ""]];
    const estadosVisitados = new Set();

    // Métricas de desempenho
    let quantidadeNosExpandidos = 0;
    let totalDeSucessoresGerados = 0;
    let usoMaximoMemoria = 0;

    while (fila.length > 0) {
        const [estadoAtual, caminhoPercorrido] = fila.shift();

        if (estadosVisitados.has(estadoAtual)) continue;
        estadosVisitados.add(estadoAtual);
        quantidadeNosExpandidos++;

        const cubo = Cube.fromString(estadoAtual);
        if (cubo.isSolved()) {
            const fatorRamificacaoMedio = totalDeSucessoresGerados / quantidadeNosExpandidos;
            return {
                caminho: caminhoPercorrido.trim(),
                nosExpandidos: quantidadeNosExpandidos,
                fatorRamificacaoMedio: fatorRamificacaoMedio,
                usoMaximoMemoria: usoMaximoMemoria
            };
        }

        const movimentosPossiveis = funcoesAuxiliares.gerarEstados(caminhoPercorrido);
        totalDeSucessoresGerados += movimentosPossiveis.length;

        for (const movimentoCompleto of movimentosPossiveis) {
            const novoCubo = Cube.fromString(estadoAtual);
            const proximoMovimento = movimentoCompleto.split(/\s+/).at(-1);
            novoCubo.move(proximoMovimento);

            fila.push([novoCubo.asString(), movimentoCompleto]);
        }

        // Atualiza estimativa de uso de memória (número de elementos guardados)
        usoMaximoMemoria = Math.max(usoMaximoMemoria, fila.length + estadosVisitados.size);
    }

    return {
        caminho: null,
        nosExpandidos: quantidadeNosExpandidos,
        fatorRamificacaoMedio: 0,
        usoMaximoMemoria: usoMaximoMemoria
    };
}

module.exports = buscaLargura;
