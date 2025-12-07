const emojis = ["🔥", "⭐", "⚡", "💧", "🌱", "💀"];
const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff", "#44ffff"];

let sequence = []; // Armazena a sequência completa de passos (posição, cor, emoji)
let currentIndex = 0; // O índice do próximo passo a ser gerado/mostrado (contagem de passos)
let n = 2; // O nível N-Back (por exemplo, N=2 significa olhar 2 passos atrás)
let score = 0; // A pontuação atual do jogador
let running = false; // Flag booleana: true se o jogo estiver em andamento, false caso contrário
let lastShownIndex = -1; // O índice na 'sequence' do último passo *mostrado*
let canAnswer = false; // Flag booleana: true se o jogador puder responder, false se já respondeu ou o passo não exige resposta


const grid = document.querySelectorAll('.cell');
const startBtn = document.getElementById('start-btn');
const btnColor = document.getElementById('match-color');
const btnEmoji = document.getElementById('match-emoji');
const nDisplay = document.getElementById('n-level');
const scoreDisplay = document.getElementById('score');
const nSelect = document.getElementById('n-back');


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
    canAnswer = true;

}

const nSelector = document.getElementById("n-back");

// Evento disparado quando o valor do seletor N-Back muda
nSelector.onchange = () => {
    n = parseInt(nSelector.value);// Atualiza a variável 'n' com o novo valor
    nDisplay.textContent = n;// Atualiza a exibição na interface
};



// =========================
// INICIAR SEQUÊNCIA
// =========================
async function startGame() {
    running = true;

    // Configuração inicial (garante que N e os displays estejam corretos)
    n = parseInt(nSelect.value);
    nDisplay.textContent = n;

    sequence = [];
    currentIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;

    // Loop principal do jogo: gera e mostra até 50 passos
    for (let i = 0; i < 50; i++) {

        // 1. Geração do passo
        const newStep = generateStep();
        sequence.push(newStep);

        // 2. Exibição do passo
        showStep(newStep);

        // Animação visual (flash rápido na célula)
        const cell = grid[newStep.pos];
        cell.classList.add("showing");
        setTimeout(() => cell.classList.remove("showing"), 200);

        lastShownIndex = currentIndex; // Registra o índice que acabou de ser mostrado

        // Pausa: espera 1200ms antes de avançar para o próximo passo
        await new Promise(r => setTimeout(r, 1200));

        currentIndex++; // Avança o índice (contador de passos)

        if (!running) break; // Permite parar o jogo se 'running' for alterado
    }
}

// =========================
// VERIFICAÇÕES
// =========================
function checkMatch(type) {
    // 1. Guardrails (Condições para NÃO permitir resposta)
    if (!canAnswer) return; // Sai se o jogador já respondeu neste passo (previne respostas múltiplas)
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
        score++;
        scoreDisplay.textContent = score;
    }

    canAnswer = false; // 🔥 trava até o próximo passo
}

// =========================
// EVENTOS
// =========================
startBtn.onclick = startGame;// Inicia o jogo ao clicar no botão "Start"
btnColor.onclick = () => checkMatch("color"); // Verifica se a cor corresponde ao clicar
btnEmoji.onclick = () => checkMatch("emoji"); // Verifica se o emoji corresponde ao clicar

