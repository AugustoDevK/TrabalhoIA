const Cube = require('cubejs');
const funcoesAuxiliares = require('./FuncoesAuxiliares.js');

function buscaProfundidadeIterativa(estadoInicial, limiteMaximo = 7) {
    const metricas = {
        nosExplorados: 0,
        totalSucessoresGerados: 0,
        nosFronteiraMaximo: 0
    };

    for (let limite = 0; limite <= limiteMaximo; limite++) {
        const estadosVisitados = new Set();
        const pilha = []; // Para simular a pilha e contar nós na fronteira
        const caminho = buscaProfundidadeLimitada(estadoInicial, "", limite, metricas, estadosVisitados, pilha);
        if (caminho !== null) {
            const movimentos = caminho.trim().split(/\s+/).filter(m => m.length > 0);
            const numeroMovimentos = movimentos.length;
            const ramificacaoMedia = metricas.totalSucessoresGerados / metricas.nosExplorados;
            return {
                numeroMovimentos: numeroMovimentos,
                caminho: caminho.trim(),
                nosExplorados: metricas.nosExplorados,
                nosFronteira: metricas.nosFronteiraMaximo,
                ramificacaoMedia: ramificacaoMedia
            };
        }
    }

    return {
        numeroMovimentos: null,
        caminho: null,
        nosExplorados: metricas.nosExplorados,
        nosFronteira: metricas.nosFronteiraMaximo,
        ramificacaoMedia: 0
    };
}

function buscaProfundidadeLimitada(estadoAtual, caminhoAtual, limite, metricas, estadosVisitados, pilha) {
    estadosVisitados.add(estadoAtual);
    pilha.push(estadoAtual);
    metricas.nosFronteiraMaximo = Math.max(metricas.nosFronteiraMaximo, pilha.length);

    const cubo = Cube.fromString(estadoAtual);
    if (cubo.isSolved()) {
        return caminhoAtual;
    }
    
    if (limite === 0) {
        pilha.pop();
        return null;
    }

    metricas.nosExplorados++;

    const movimentosPossiveis = funcoesAuxiliares.gerarEstados(caminhoAtual);
    metricas.totalSucessoresGerados += movimentosPossiveis.length;

    for (const movimentoCompleto of movimentosPossiveis) {
        const novoCubo = Cube.fromString(estadoAtual);
        const movimento = movimentoCompleto.split(/\s+/).at(-1);
        novoCubo.move(movimento);

        const novoEstado = novoCubo.asString();
        if (!estadosVisitados.has(novoEstado)) {
            const resultado = buscaProfundidadeLimitada(novoEstado, movimentoCompleto, limite - 1, metricas, estadosVisitados, pilha);
            if (resultado !== null) {
                return resultado;
            }
        }
    }

    pilha.pop();
    return null;
}

module.exports = buscaProfundidadeIterativa;