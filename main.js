const Cube = require('cubejs');
const buscaLargura = require('./Bfs.js');
const buscaProfundidadeIterativa = require('./Dfsi.js');
const buscaAEstrela = require('./AStar.js');

const { performance } = require('perf_hooks');

const cube = new Cube;
console.log("Estado inicial do cubo:");
console.log(cube.asString());

// Aplicando movimentos para embaralhar
cube.move("F' L D R2 U'"); // 5 movimentos

const estadoInicial = cube.asString();
console.log("Estado embaralhado:");
console.log(estadoInicial);
console.log("="*50);

// Teste BFS (comentado para performance)
// const tBFS0 = performance.now();
// const solucaoBFS = buscaLargura(estadoInicial);
// const tBFS1 = performance.now();
// console.log("=== BUSCA EM LARGURA (BFS) ===");
// console.log("Solução encontrada:", solucaoBFS);
// console.log(`Tempo de execução: ${(tBFS1 - tBFS0).toFixed(2)} ms`);
// console.log("="*50);

// Teste IDDFS
const tDFS0 = performance.now();
const solucaoDFS = buscaProfundidadeIterativa(estadoInicial, 8);
const tDFS1 = performance.now();
console.log("=== BUSCA EM PROFUNDIDADE ITERATIVA (IDDFS) ===");
console.log("Solução encontrada:", solucaoDFS);
console.log(`Tempo de execução: ${(tDFS1 - tDFS0).toFixed(2)} ms`);
console.log("="*50);

// Teste A*
const tAStar0 = performance.now();
const solucaoAStar = buscaAEstrela(estadoInicial);
const tAStar1 = performance.now();
console.log("=== BUSCA A* ===");
console.log("Solução encontrada:", solucaoAStar);
console.log(`Tempo de execução: ${(tAStar1 - tAStar0).toFixed(2)} ms`);
console.log("="*50);

// Comparação dos resultados
console.log("=== COMPARAÇÃO DOS ALGORITMOS ===");
console.log("IDDFS:");
console.log(`  Número de movimentos: ${solucaoDFS.numeroMovimentos || 'N/A'}`);
console.log(`  Caminho: ${solucaoDFS.caminho}`);
console.log(`  Nós explorados: ${solucaoDFS.nosExplorados}`);
console.log(`  Nós na fronteira: ${solucaoDFS.nosFronteira}`);
console.log(`  Ramificação média: ${solucaoDFS.ramificacaoMedia.toFixed(2)}`);
console.log(`  Tempo: ${(tDFS1 - tDFS0).toFixed(2)} ms`);

console.log("\nA*:");
console.log(`  Número de movimentos: ${solucaoAStar.numeroMovimentos || 'N/A'}`);
console.log(`  Caminho: ${solucaoAStar.caminho}`);
console.log(`  Nós explorados: ${solucaoAStar.nosExplorados}`);
console.log(`  Nós na fronteira: ${solucaoAStar.nosFronteira}`);
console.log(`  Ramificação média: ${solucaoAStar.ramificacaoMedia.toFixed(2)}`);
console.log(`  Custo da solução: ${solucaoAStar.custoSolucao}`);
console.log(`  Tempo: ${(tAStar1 - tAStar0).toFixed(2)} ms`);

console.log("\n=== MÉTRICAS SOLICITADAS ===");
console.log("1. Número de movimentos até a solução:");
console.log(`   IDDFS: ${solucaoDFS.numeroMovimentos || 'N/A'} | A*: ${solucaoAStar.numeroMovimentos || 'N/A'}`);
console.log("2. Tempo:");
console.log(`   IDDFS: ${(tDFS1 - tDFS0).toFixed(2)}ms | A*: ${(tAStar1 - tAStar0).toFixed(2)}ms`);
console.log("3. Quantidade de nós na fronteira (ficaram para explorar):");
console.log(`   IDDFS: ${solucaoDFS.nosFronteira} | A*: ${solucaoAStar.nosFronteira}`);
console.log("4. Nós explorados:");
console.log(`   IDDFS: ${solucaoDFS.nosExplorados} | A*: ${solucaoAStar.nosExplorados}`);
console.log("5. Ramificação média:");
console.log(`   IDDFS: ${solucaoDFS.ramificacaoMedia.toFixed(2)} | A*: ${solucaoAStar.ramificacaoMedia.toFixed(2)}`);