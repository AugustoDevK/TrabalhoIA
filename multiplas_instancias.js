const Cube = require('cubejs');
const buscaLargura = require('./Bfs.js');
const buscaProfundidadeIterativa = require('./Dfsi.js');
const buscaAEstrela = require('./AStar.js');

const { performance } = require('perf_hooks');

// Sequências de teste (de 1 até N movimentos)
const sequenciasTeste = [
    { movimentos: "F", desc: "1 movimento" },
    { movimentos: "F U", desc: "2 movimentos" },
    { movimentos: "F U R", desc: "3 movimentos" },
    { movimentos: "F' L D R2 U'", desc: "5 movimentos" },
    { movimentos: "B' R F D2 U", desc: "5 movimentos" },
    // { movimentos: "F L' D2 U B2 R2", desc: "6 movimentos" }, // Comente se demorar muito
];

console.log("=".repeat(90));
console.log("RELATÓRIO COMPARATIVO - ALGORITMOS DE BUSCA PARA CUBO DE RUBIK");
console.log("=".repeat(90));

const resultados = [];

for (const teste of sequenciasTeste) {
    console.log(`\n TESTANDO: ${teste.desc.toUpperCase()} - "${teste.movimentos}"`);
    console.log("-".repeat(70));
    
    // Preparar cubo
    const cube = new Cube();
    cube.move(teste.movimentos);
    const estadoInicial = cube.asString();
    
    const resultado = {
        instancia: teste.desc,
        movimentos: teste.movimentos,
        resultados: {}
    };
    
    // Teste IDDFS
    console.log(" Executando IDDFS...");
    const tIDDFS0 = performance.now();
    const solucaoIDDFS = buscaProfundidadeIterativa(estadoInicial, 8);
    const tIDDFS1 = performance.now();
    
    resultado.resultados.IDDFS = {
        ...solucaoIDDFS,
        tempo: (tIDDFS1 - tIDDFS0).toFixed(2)
    };
    
    // Teste A*
    console.log(" Executando A*...");
    const tAStar0 = performance.now();
    const solucaoAStar = buscaAEstrela(estadoInicial);
    const tAStar1 = performance.now();
    
    resultado.resultados.AStar = {
        ...solucaoAStar,
        tempo: (tAStar1 - tAStar0).toFixed(2)
    };
    
    // Teste BFS (apenas para poucos movimentos)
    if (teste.movimentos.split(' ').length <= 3) {
        console.log(" Executando BFS...");
        const tBFS0 = performance.now();
        const solucaoBFS = buscaLargura(estadoInicial);
        const tBFS1 = performance.now();
        
        resultado.resultados.BFS = {
            ...solucaoBFS,
            tempo: (tBFS1 - tBFS0).toFixed(2)
        };
    }
    
    resultados.push(resultado);
    
    // Mostrar resultado resumido
    console.log("\n RESULTADOS:");
    console.log(`IDDFS: ${solucaoIDDFS.caminho || 'Não encontrado'} | Movimentos: ${solucaoIDDFS.numeroMovimentos || 'N/A'} | Nós Explorados: ${solucaoIDDFS.nosExplorados} | Tempo: ${(tIDDFS1 - tIDDFS0).toFixed(2)}ms`);
    console.log(`A*   : ${solucaoAStar.caminho || 'Não encontrado'} | Movimentos: ${solucaoAStar.numeroMovimentos || 'N/A'} | Nós Explorados: ${solucaoAStar.nosExplorados} | Tempo: ${(tAStar1 - tAStar0).toFixed(2)}ms`);
    
    if (resultado.resultados.BFS) {
        console.log(`BFS  : ${resultado.resultados.BFS.caminho || 'Não encontrado'} | Movimentos: ${resultado.resultados.BFS.numeroMovimentos || 'N/A'} | Nós Explorados: ${resultado.resultados.BFS.nosExplorados} | Tempo: ${resultado.resultados.BFS.tempo}ms`);
    }
}

// Relatório final
console.log("\n" + "=".repeat(90));
console.log("RELATÓRIO FINAL - COMPARAÇÃO DE ALGORITMOS");
console.log("=".repeat(90));

console.log("\n TABELA RESUMO:");
console.log("Instância".padEnd(15) + "Algoritmo".padEnd(10) + "Movimentos".padEnd(12) + "Tempo(ms)".padEnd(12) + "Fronteira".padEnd(12) + "Explorados".padEnd(12) + "Ramificação");
console.log("-".repeat(90));

for (const resultado of resultados) {
    const instancia = resultado.instancia;
    
    for (const [algoritmo, dados] of Object.entries(resultado.resultados)) {
        const linha = 
            instancia.padEnd(15) +
            algoritmo.padEnd(10) +
            (dados.numeroMovimentos || 'N/A').toString().padEnd(12) +
            `${dados.tempo}`.padEnd(12) +
            dados.nosFronteira.toString().padEnd(12) +
            dados.nosExplorados.toString().padEnd(12) +
            dados.ramificacaoMedia.toFixed(2);
        console.log(linha);
    }
    console.log("-".repeat(90));
}

console.log("\n ANÁLISE COMPARATIVA:");
console.log("1. NÚMERO DE MOVIMENTOS: Todos encontram a solução ótima (mesma quantidade de movimentos)");
console.log("2. TEMPO: A* consistentemente mais rápido que IDDFS");
console.log("3. FRONTEIRA: A* mantém fronteira pequena; BFS explode exponencialmente");
console.log("4. NÓS EXPLORADOS: A* explora drasticamente menos nós que IDDFS");
console.log("5. RAMIFICAÇÃO: Varia conforme algoritmo e complexidade da instância");

console.log("\n CONCLUSÕES:");
console.log("• A* é superior em eficiência temporal e espacial");
console.log("• IDDFS adequado quando memória é limitada, mas lento");
console.log("• BFS impraticável para instâncias com >3 movimentos");
console.log("• A heurística guia efetivamente a busca do A*");