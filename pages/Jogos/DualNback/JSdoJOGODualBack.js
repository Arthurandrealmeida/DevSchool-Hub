const emojis = ["🔥", "⭐", "⚡", "💧", "🌱", "💀"];
const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff", "#44ffff"];

let sequence = []; // Armazena a sequência completa de passos (posição, cor, emoji)
let currentIndex = 0; // O índice do próximo passo a ser gerado/mostrado (contagem de passos)
let n = 2; // O nível N-Back (por exemplo, N=2 significa olhar 2 passos atrás)
let score = 0; // A pontuação atual do jogador
let running = false; // Flag booleana: true se o jogo estiver em andamento, false caso contrário
let lastShownIndex = -1; // O índice na 'sequence' do último passo *mostrado*
let canAnswer = false; // Flag booleana: true se o jogador puder responder, false se já respondeu ou o passo não exige resposta
let stepTimer;
let flashTimer;
let session = 0;
let incorrectAnswers = 0;
let correctAnswers = 0;
const answeredTypes = new Set();
let stepFeedback = [];


const grid = document.querySelectorAll('.cell');
const startBtn = document.getElementById('start-btn');
const btnColor = document.getElementById('match-color');
const btnEmoji = document.getElementById('match-emoji');
const nDisplay = document.getElementById('n-level');
const scoreDisplay = document.getElementById('score');
const nSelect = document.getElementById('n-back');
const stopBtn = document.getElementById('stop-btn');
const progressDisplay = document.getElementById('step-count');
const feedback = document.getElementById('game-feedback');


// =========================
// GERAR PASSO
// =========================
function generateStep() {
    return {
       pos: Math.floor(Math.random() * 9), // Posição (índice 0-8) onde o emoji aparecerá
        color: colors[Math.floor(Math.random() * colors.length)], // Cor aleatória do array 'colors'
        emoji: emojis[Math.floor(Math.random() * emojis.length)] // Emoji aleatório do array 'emojis'
    };
}

// =========================
// MOSTRAR PASSO
// =========================
function showStep(step) {
    // 1. Limpa todas as células: remove a cor e o emoji
    grid.forEach(c => {
        c.style.background = "#ffffff";
        c.textContent = "";
    });

    // 2. Exibe o passo atual (cor e emoji) na célula correta
    const cell = grid[step.pos];
    cell.style.background = step.color;
    cell.textContent = step.emoji;

    // 3. Permite a resposta
    answeredTypes.clear();
    stepFeedback = [];
    canAnswer = lastShownIndex >= n;
    btnColor.disabled = !canAnswer;
    btnEmoji.disabled = !canAnswer;
    progressDisplay.textContent = `Passo ${lastShownIndex + 1} de 50`;
    feedback.textContent = canAnswer
        ? `Compare com ${n} passos atrás. Marque apenas o que for igual.`
        : `Memorize: faltam ${n - lastShownIndex} passos para começar a comparar.`;

}

const nSelector = document.getElementById("n-back");

// Evento disparado quando o valor do seletor N-Back muda
nSelector.onchange = () => {
    if (running) {
        nSelector.value = String(n);
        return;
    }
    n = parseInt(nSelector.value);// Atualiza a variável 'n' com o novo valor
    nDisplay.textContent = n;// Atualiza a exibição na interface
};



// =========================
// INICIAR SEQUÊNCIA
// =========================
async function startGame() {
    if (running) return;
    running = true;
    const currentSession = ++session;
    startBtn.disabled = true;
    startBtn.textContent = "Em andamento";
    stopBtn.disabled = false;
    nSelect.disabled = true;

    // Configuração inicial (garante que N e os displays estejam corretos)
    n = parseInt(nSelect.value);
    nDisplay.textContent = n;

    sequence = [];
    currentIndex = 0;
    score = 0;
    incorrectAnswers = 0;
    correctAnswers = 0;
    lastShownIndex = -1;
    scoreDisplay.textContent = score;

    // Loop principal do jogo: gera e mostra até 50 passos
    for (let i = 0; i < 50; i++) {

        // 1. Geração do passo
        const newStep = generateStep();
        sequence.push(newStep);

        lastShownIndex = currentIndex;
        // 2. Exibição do passo
        showStep(newStep);

        // Animação visual (flash rápido na célula)
        const cell = grid[newStep.pos];
        cell.classList.add("showing");
        flashTimer = setTimeout(() => cell.classList.remove("showing"), 200);

        await new Promise(r => { stepTimer = setTimeout(r, 1600); });

        if (!running || currentSession !== session) return;

        currentIndex++; // Avança o índice (contador de passos)

    }
    stopGame(true);
}

function stopGame(completed = false) {
    running = false;
    canAnswer = false;
    session++;
    clearTimeout(stepTimer);
    clearTimeout(flashTimer);
    btnColor.disabled = true;
    btnEmoji.disabled = true;
    stopBtn.disabled = true;
    startBtn.disabled = false;
    startBtn.textContent = "Jogar novamente";
    nSelect.disabled = false;
    grid.forEach(cell => {
        cell.classList.remove("showing");
        cell.style.background = "#ffffff";
        cell.textContent = "";
    });
    feedback.textContent = `${completed ? "Sessão concluída!" : "Sessão encerrada."} Pontuação: ${score}. ${correctAnswers} acertos (+1) e ${incorrectAnswers} marcações incorretas (-1; mínimo de 0 pontos).`;
    startBtn.focus();
}

// =========================
// VERIFICAÇÕES
// =========================
function checkMatch(type) {
    // 1. Guardrails (Condições para NÃO permitir resposta)
    if (!running || !canAnswer || answeredTypes.has(type)) return;
    if (type !== "color" && type !== "emoji") return;
    if (lastShownIndex < n) return; // Sai se não houver passos suficientes para olhar N passos atrás

    // 2. Determina os passos de comparação
    const now = sequence[lastShownIndex]; // O passo atual
    const past = sequence[lastShownIndex - n]; // O passo N-Back

    let match = false;

    // Verifica se a cor ou o emoji (dependendo do 'type') são iguais
    if (type === "color") match = now.color === past.color;
    if (type === "emoji") match = now.emoji === past.emoji;

    // 4. Atualização da pontuação
    if (match) {
        correctAnswers++;
        score++;
    }
    else {
        incorrectAnswers++;
        score = Math.max(0, score - 1);
    }
    scoreDisplay.textContent = score;

    answeredTypes.add(type);
    const button = type === "color" ? btnColor : btnEmoji;
    button.disabled = true;
    stepFeedback.push(`${type === "color" ? "Cor" : "Emoji"}: ${match ? "igual, +1 ponto" : "diferente, -1 ponto (mínimo 0)"}.`);
    feedback.textContent = stepFeedback.join(" ");
    canAnswer = answeredTypes.size < 2;
}

// =========================
// EVENTOS
// =========================
startBtn.onclick = startGame;// Inicia o jogo ao clicar no botão "Start"
btnColor.onclick = () => checkMatch("color"); // Verifica se a cor corresponde ao clicar
btnEmoji.onclick = () => checkMatch("emoji"); // Verifica se o emoji corresponde ao clicar
stopBtn.onclick = () => stopGame();

btnColor.disabled = true;
btnEmoji.disabled = true;
nDisplay.textContent = n;

document.addEventListener("keydown", event => {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) || event.target.isContentEditable) return;
    const key = event.key.toLowerCase();
    if (key !== "c" && key !== "e") return;
    if (!running) return;
    event.preventDefault();
    checkMatch(key === "c" ? "color" : "emoji");
});

window.addEventListener("pagehide", () => stopGame());
