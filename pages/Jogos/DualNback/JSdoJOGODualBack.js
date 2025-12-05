const emojis = ["🔥", "⭐", "⚡", "💧", "🌱", "💀"];
const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff", "#44ffff"];

let sequence = [];
let currentIndex = 0;
let n = 2;
let score = 0;
let running = false;
let lastShownIndex = -1;
let canAnswer = false;



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
        pos: Math.floor(Math.random() * 9),
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
    };
}

// =========================
// MOSTRAR PASSO
// =========================
function showStep(step) {
    grid.forEach(c => {
        c.style.background = "#ffffff";
        c.textContent = "";
    });

    const cell = grid[step.pos];
    cell.style.background = step.color;
    cell.textContent = step.emoji;

    canAnswer = true;

}

const nSelector = document.getElementById("n-back");

nSelector.onchange = () => {
    n = parseInt(nSelector.value);
    nDisplay.textContent = n;
};



// =========================
// INICIAR SEQUÊNCIA
// =========================
async function startGame() {
    running = true;

    n = parseInt(nSelect.value);
    nDisplay.textContent = n;

    sequence = [];
    currentIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;

    for (let i = 0; i < 50; i++) {

        const newStep = generateStep();
        sequence.push(newStep);

        console.log(
    `${i}: pos=${newStep.pos}, color=${newStep.color}, emoji=${newStep.emoji}`
);


        showStep(newStep);

        // animação correta
        const cell = grid[newStep.pos];
        cell.classList.add("showing");
        setTimeout(() => cell.classList.remove("showing"), 200);

        lastShownIndex = currentIndex;

        await new Promise(r => setTimeout(r, 1200));

        currentIndex++;

        if (!running) break;
    }
}

// =========================
// VERIFICAÇÕES
// =========================
function checkMatch(type) {
    if (!canAnswer) return; // 🔥 já respondeu neste passo
    if (lastShownIndex < n) return;

    const now = sequence[lastShownIndex];
    const past = sequence[lastShownIndex - n];

    let match = false;

    if (type === "color") match = now.color === past.color;
    if (type === "emoji") match = now.emoji === past.emoji;

    if (match) {
        score++;
        scoreDisplay.textContent = score;
    }

    canAnswer = false; // 🔥 trava até o próximo passo
}

// =========================
// EVENTOS
// =========================
startBtn.onclick = startGame;
btnColor.onclick = () => checkMatch("color");
btnEmoji.onclick = () => checkMatch("emoji");

