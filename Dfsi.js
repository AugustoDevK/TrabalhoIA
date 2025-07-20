const Cube = require('cubejs');
const funcoesAuxiliares = require('./FuncoesAuxiliares.js');

Cube.initSolver();

function buscaProfundidadeIterativa(estadoInicial, limiteMaximo = 7) {
    const metricas = {
        nosExpandidos: 0,
        totalDeSucessoresGerados: 0,
        usoMaximoMemoria: 0
    };

    for (let limite = 0; limite <= limiteMaximo; limite++) {
        const estadosVisitados = new Set();
        const caminho = buscaProfundidadeLimitada(estadoInicial, "", limite, metricas, estadosVisitados);
        if (caminho !== null) {
            const fatorRamificacaoMedio = metricas.totalDeSucessoresGerados / metricas.nosExpandidos;
            return {
                caminho: caminho.trim(),
                nosExpandidos: metricas.nosExpandidos,
                fatorRamificacaoMedio: fatorRamificacaoMedio,
                usoMaximoMemoria: metricas.usoMaximoMemoria
            };
        }
    }

    return {
        caminho: null,
        nosExpandidos: metricas.nosExpandidos,
        fatorRamificacaoMedio: 0,
        usoMaximoMemoria: metricas.usoMaximoMemoria
    };
}

function buscaProfundidadeLimitada(estadoAtual, caminhoAtual, limite, metricas, estadosVisitados) {
    estadosVisitados.add(estadoAtual);
    metricas.usoMaximoMemoria = Math.max(metricas.usoMaximoMemoria, estadosVisitados.size);

    const cubo = Cube.fromString(estadoAtual);
    if (cubo.isSolved()) return caminhoAtual;
    if (limite === 0) return null;

    metricas.nosExpandidos++;

    const movimentosPossiveis = funcoesAuxiliares.gerarEstados(caminhoAtual);
    metricas.totalDeSucessoresGerados += movimentosPossiveis.length;

    for (const movimentoCompleto of movimentosPossiveis) {
        const novoCubo = Cube.fromString(estadoAtual);
        const movimento = movimentoCompleto.split(/\s+/).at(-1);
        novoCubo.move(movimento);

        const resultado = buscaProfundidadeLimitada(novoCubo.asString(), movimentoCompleto, limite - 1, metricas, estadosVisitados);
        if (resultado !== null) return resultado;
    }

    return null;
}

module.exports = buscaProfundidadeIterativa;
