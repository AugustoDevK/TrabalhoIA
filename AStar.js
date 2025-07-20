const Cube = require('cubejs');
const funcoesAuxiliares = require('./FuncoesAuxiliares.js');

// Heurística baseada no número de peças fora do lugar
function calcularHeuristica(estadoCubo) {
    const cubo = Cube.fromString(estadoCubo);
    const cuboResolvido = new Cube();
    
    let pecasForaDoLugar = 0;
    const estadoAtual = cubo.asString();
    const estadoResolvido = cuboResolvido.asString();
    
    // Conta quantas posições são diferentes entre o estado atual e o resolvido
    for (let i = 0; i < estadoAtual.length; i++) {
        if (estadoAtual[i] !== estadoResolvido[i]) {
            pecasForaDoLugar++;
        }
    }
    
    // Divide por um fator para tornar a heurística mais otimista
    // (uma heurística admissível deve nunca superestimar o custo real)
    return Math.floor(pecasForaDoLugar / 8);
}

function buscaAEstrela(estadoInicial) {
    // Lista de prioridade (heap simulado com array)
    const listaAberta = [];
    const estadosVisitados = new Set();
    const custosG = new Map(); // Custo real do caminho até o nó
    
    // Métricas de desempenho
    let nosExpandidos = 0;
    let totalSucessoresGerados = 0;
    let usoMaximoMemoria = 0;
    
    // Estado inicial
    const custoInicialG = 0;
    const custoInicialH = calcularHeuristica(estadoInicial);
    const custoInicialF = custoInicialG + custoInicialH;
    
    listaAberta.push({
        estado: estadoInicial,
        caminho: "",
        custoG: custoInicialG,
        custoH: custoInicialH,
        custoF: custoInicialF
    });
    
    custosG.set(estadoInicial, custoInicialG);
    
    while (listaAberta.length > 0) {
        // Ordena por custo F (A* sempre expande o nó com menor f(n))
        listaAberta.sort((a, b) => a.custoF - b.custoF);
        const noAtual = listaAberta.shift();
        
        if (estadosVisitados.has(noAtual.estado)) continue;
        estadosVisitados.add(noAtual.estado);
        nosExpandidos++;
        
        // Verifica se chegou à solução
        const cubo = Cube.fromString(noAtual.estado);
        if (cubo.isSolved()) {
            const fatorRamificacaoMedio = totalSucessoresGerados / nosExpandidos;
            return {
                caminho: noAtual.caminho.trim(),
                nosExpandidos: nosExpandidos,
                fatorRamificacaoMedio: fatorRamificacaoMedio,
                usoMaximoMemoria: usoMaximoMemoria
            };
        }
        
        // Gera sucessores
        const movimentosPossiveis = funcoesAuxiliares.gerarEstados(noAtual.caminho);
        totalSucessoresGerados += movimentosPossiveis.length;
        
        for (const movimentoCompleto of movimentosPossiveis) {
            const novoCubo = Cube.fromString(noAtual.estado);
            const proximoMovimento = movimentoCompleto.split(/\s+/).at(-1);
            novoCubo.move(proximoMovimento);
            
            const novoEstado = novoCubo.asString();
            const novoCustoG = noAtual.custoG + 1; // Cada movimento tem custo 1
            
            // Verifica se já foi visitado ou se encontrou um caminho melhor
            if (estadosVisitados.has(novoEstado)) continue;
            
            const custoGAnterior = custosG.get(novoEstado);
            if (custoGAnterior !== undefined && novoCustoG >= custoGAnterior) {
                continue;
            }
            
            // Calcula custos para o novo nó
            const novoCustoH = calcularHeuristica(novoEstado);
            const novoCustoF = novoCustoG + novoCustoH;
            
            custosG.set(novoEstado, novoCustoG);
            
            listaAberta.push({
                estado: novoEstado,
                caminho: movimentoCompleto,
                custoG: novoCustoG,
                custoH: novoCustoH,
                custoF: novoCustoF
            });
        }
        
        // Atualiza estimativa de uso de memória
        usoMaximoMemoria = Math.max(usoMaximoMemoria, listaAberta.length + estadosVisitados.size);
    }
    
    return {
        caminho: null,
        nosExpandidos: nosExpandidos,
        fatorRamificacaoMedio: totalSucessoresGerados > 0 ? totalSucessoresGerados / nosExpandidos : 0,
        usoMaximoMemoria: usoMaximoMemoria
    };
}

module.exports = buscaAEstrela;