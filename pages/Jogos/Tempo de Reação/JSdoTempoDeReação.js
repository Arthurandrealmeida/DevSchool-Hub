// Selecionando elementos
const gameBox = document.querySelector('.game-box');
const gameText = gameBox.querySelector('span');

const bestEl = document.getElementById('best-time');
const averageEl = document.getElementById('average-time');
const attemptsEl = document.getElementById('attempts');

const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');

// Variáveis do jogo
let timeoutID;
let startTime;
let reactionTimes = []; 

// Função para atualizar estatísticas
function updateStats() {
    const attempts = reactionTimes.length;
    attemptsEl.textContent = attempts;

    if (attempts === 0) return;

    const best = Math.min(...reactionTimes);
    const average = reactionTimes.reduce((a, b) => a + b, 0) / attempts;

    bestEl.textContent = best.toFixed(0);
    averageEl.textContent = average.toFixed(0);
}

// Reset visual da caixinha
function setState(state, text) {
    gameBox.className = `game-box ${state}`;
    gameText.textContent = text;
}

// Começo do jogo
function startGame() {
    setState('waiting', 'Aguarde o verde...');

    // Tempo aleatório entre 1.5s e 4s
    const randomDelay = Math.random() * 2500 + 1500;

    timeoutID = setTimeout(() => {
        setState('ready', 'CLIQUE!');
        startTime = Date.now();
    }, randomDelay);
}

// Clique no quadrado
gameBox.addEventListener('click', () => {
    const state = gameBox.classList[1];

    // Caso 1: Idle → Começar
    if (state === 'idle' || state === 'result' || state === 'early') {
        startGame();
        return;
    }

    // Caso 2: Esperando → clicou antes
    if (state === 'waiting') {
        clearTimeout(timeoutID);
        setState('early', 'Muito cedo! Clique para tentar novamente.');
        return;
    }

    // Caso 3: Verde → medir tempo
    if (state === 'ready') {
        const reaction = Date.now() - startTime;

        reactionTimes.push(reaction);

        // Exibir resultado
        setState('result', `Seu tempo foi ${reaction} ms. Clique para tentar novamente.`);

        // Registrar no histórico
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = reaction + ' ms';
        historyList.prepend(item);

        historySection.classList.remove('hidden');

        updateStats();
    }
});

// Estado inicial
setState('idle', 'Clique para começar!');
