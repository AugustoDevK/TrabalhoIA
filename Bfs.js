const Cube = require('cubejs');
const funcoesAuxiliares = require('./FuncoesAuxiliares.js');

function buscaLargura(estadoInicial) {
    const fila = [[estadoInicial, ""]];
    const estadosVisitados = new Set();

    // Métricas de desempenho
    let nosExplorados = 0;
    let totalSucessoresGerados = 0;
    let tamanhoMaximoFronteira = 0;

    while (fila.length > 0) {
        // Atualiza tamanho máximo da fronteira
        tamanhoMaximoFronteira = Math.max(tamanhoMaximoFronteira, fila.length);
        
        const [estadoAtual, caminhoPercorrido] = fila.shift();

        if (estadosVisitados.has(estadoAtual)) continue;
        estadosVisitados.add(estadoAtual);
        nosExplorados++;

        const cubo = Cube.fromString(estadoAtual);
        if (cubo.isSolved()) {
            const movimentos = caminhoPercorrido.trim().split(/\s+/).filter(m => m.length > 0);
            const numeroMovimentos = movimentos.length;
            const ramificacaoMedia = totalSucessoresGerados / nosExplorados;
            const nosFronteira = fila.length; // Nós que ficaram na fronteira
            
            return {
                numeroMovimentos: numeroMovimentos,
                caminho: caminhoPercorrido.trim(),
                nosExplorados: nosExplorados,
                nosFronteira: nosFronteira,
                ramificacaoMedia: ramificacaoMedia
            };
        }

        const movimentosPossiveis = funcoesAuxiliares.gerarEstados(caminhoPercorrido);
        totalSucessoresGerados += movimentosPossiveis.length;

        for (const movimentoCompleto of movimentosPossiveis) {
            const novoCubo = Cube.fromString(estadoAtual);
            const proximoMovimento = movimentoCompleto.split(/\s+/).at(-1);
            novoCubo.move(proximoMovimento);

            const novoEstado = novoCubo.asString();
            if (!estadosVisitados.has(novoEstado)) {
                fila.push([novoEstado, movimentoCompleto]);
            }
        }
    }

    return {
        numeroMovimentos: null,
        caminho: null,
        nosExplorados: nosExplorados,
        nosFronteira: 0,
        ramificacaoMedia: 0
    };
}

module.exports = buscaLargura;