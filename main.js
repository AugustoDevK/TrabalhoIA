const Cube = require('cubejs');
const buscaLargura = require('./Bfs.js');
const buscaProfundidadeIterativa = require('./Dfsi.js');
const buscaAEstrela = require('./AStar.js');
const readline = require('readline');
const { performance } = require('perf_hooks');

Cube.initSolver();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const movimentos = ["F", "F'", "F2", "B", "B'", "B2", "L", "L'", "L2", "R", "R'", "R2", "U", "U'", "U2", "D", "D'", "D2"];

function embaralharCubo(quantidade) {
    const cube = new Cube();
    const movimentosAleatorios = [];
    
    for (let i = 0; i < quantidade; i++) {
        movimentosAleatorios.push(movimentos[Math.floor(Math.random() * movimentos.length)]);
    }
    
    const sequencia = movimentosAleatorios.join(" ");
    console.log(`Movimentos aplicados: ${sequencia}`);
    cube.move(sequencia);
    return cube.asString();
}

function executarAlgoritmo(algoritmo, estadoInicial) {
    console.log(`\nExecutando ${algoritmo}...`);
    
    const inicio = performance.now();
    let resultado;
    
    if (algoritmo === 'BFS') {
        resultado = buscaLargura(estadoInicial);
    } else if (algoritmo === 'IDDFS') {
        resultado = buscaProfundidadeIterativa(estadoInicial, 7);
    } else if (algoritmo === 'A*') {
        resultado = buscaAEstrela(estadoInicial);
    }
    
    const fim = performance.now();
    
    console.log(`\n--- RESULTADO ${algoritmo} ---`);
    if (resultado.caminho) {
        console.log(`Solução: ${resultado.caminho}`);
        console.log(`Movimentos: ${resultado.caminho.split(' ').length}`);
    } else {
        console.log("Solução não encontrada");
    }
    console.log(`Tempo: ${(fim - inicio).toFixed(2)} ms`);
    console.log(`Nós expandidos: ${resultado.nosExpandidos}`);
    console.log(`Fator ramificação: ${resultado.fatorRamificacaoMedio.toFixed(2)}`);
    console.log(`Uso memória: ${resultado.usoMaximoMemoria}`);
}

function menu() {
    console.log("\n=== SOLUCIONADOR CUBO MÁGICO ===");
    console.log("1 - BFS");
    console.log("2 - IDDFS");
    console.log("3 - A*");
    console.log("4 - Sair");
    
    rl.question("Escolha o algoritmo (1-4): ", (escolha) => {
        if (escolha === '4') {
            console.log("Saindo...");
            rl.close();
            return;
        }
        
        let algoritmo;
        if (escolha === '1') algoritmo = 'BFS';
        else if (escolha === '2') algoritmo = 'IDDFS';
        else if (escolha === '3') algoritmo = 'A*';
        else {
            console.log("Opção inválida!");
            menu();
            return;
        }
        
        rl.question("Quantos movimentos aleatórios? (1-10): ", (num) => {
            const quantidade = parseInt(num);
            if (quantidade < 1 || quantidade > 10) {
                console.log("Digite um número entre 1 e 10!");
                menu();
                return;
            }
            
            const estadoInicial = embaralharCubo(quantidade);
            executarAlgoritmo(algoritmo, estadoInicial);
            
            setTimeout(() => {
                rl.question("\nFazer outro teste? (s/n): ", (resp) => {
                    if (resp.toLowerCase() === 's') {
                        menu();
                    } else {
                        rl.close();
                    }
                });
            }, 100);
        });
    });
}

console.log("Iniciando solucionador...");
menu();