const ops = document.querySelectorAll(".op-btn");
const diffs = document.querySelectorAll(".diff-btn");

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const opTitle = document.getElementById("operation-title");
const diffTitle = document.getElementById("difficulty-title");

let selectedOp = null;
let difficulty = null;

let correctAnswer = 0;
let timer = 0;
let score = 0;
let interval = null;

// ===========================
// CONFIG DE DIFICULDADE
// ===========================
const difficultySettings = {
    easy:  { time: 12, maxNum: 10 },
    medium:{ time: 8,  maxNum: 20 },
    hard:  { time: 5,  maxNum: 50 }
};

// ===========================
// NOVA PERGUNTA
// ===========================
function newQuestion() {
    const max = difficultySettings[difficulty].maxNum;

    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;

    if (selectedOp === "/") {
        a = a * b;
    }

    question.textContent = `${a} ${selectedOp} ${b}`;

    switch (selectedOp) {
        case "+": correctAnswer = a + b; break;
        case "-": correctAnswer = a - b; break;
        case "*": correctAnswer = a * b; break;
        case "/": correctAnswer = a / b; break;
    }

    answer.value = "";
    answer.focus();

    startTimer();
}

// ===========================
// TIMER
// ===========================
function startTimer() {
    clearInterval(interval);

    timer = difficultySettings[difficulty].time;
    timerDisplay.textContent = timer;

    interval = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;

        if (timer <= 0) {
            clearInterval(interval);
            question.textContent = "⛔ Tempo esgotado!";
            setTimeout(newQuestion, 1000);
        }
    }, 1000);
}

// ===========================
// CHECAR RESPOSTA
// ===========================
answer.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        const val = Number(answer.value);

        if (val === correctAnswer) {
            score++;
            scoreDisplay.textContent = score;
            question.textContent = "✔ Correto!";
        } else {
            question.textContent = `❌ Errado! (${correctAnswer})`;
        }

        clearInterval(interval);
        setTimeout(newQuestion, 700);
    }
});

// ===========================
// ESCOLHER OPERAÇÃO
// ===========================
ops.forEach(btn => {
    btn.onclick = () => {
        if (!difficulty) {
            alert("Escolha a dificuldade primeiro!");
            return;
        }

        selectedOp = btn.dataset.op;
        opTitle.textContent = "Operação: " + selectedOp;

        score = 0;
        scoreDisplay.textContent = 0;

        newQuestion();
    };
});

// ===========================
// ESCOLHER DIFICULDADE
// ===========================
diffs.forEach(btn => {
    btn.onclick = () => {
        difficulty = btn.dataset.diff;
        diffTitle.textContent = "Dificuldade: " + difficulty.toUpperCase();

        if (selectedOp) newQuestion();
    };
});
