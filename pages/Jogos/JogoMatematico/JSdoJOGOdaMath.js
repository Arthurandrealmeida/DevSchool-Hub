const ops = document.querySelectorAll(".op-btn");
const diffs = document.querySelectorAll(".diff-btn");

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const opTitle = document.getElementById("operation-title");
const diffTitle = document.getElementById("difficulty-title");
const feedback = document.getElementById("math-feedback");
const confirmButton = document.getElementById("confirm-answer");
const stopButton = document.getElementById("stop-training");

let selectedOp = null;
let difficulty = null;

let correctAnswer = 0;
let timer = 0;
let score = 0;
let interval = null;
let nextQuestionTimer = null;
let acceptingAnswer = false;

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
    clearTimers();
    if (!difficulty || !selectedOp) return;

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
    acceptingAnswer = true;
    answer.disabled = false;
    answer.setAttribute("aria-invalid", "false");
    confirmButton.disabled = false;
    stopButton.disabled = false;
    feedback.textContent = "";
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
            acceptingAnswer = false;
            answer.disabled = true;
            confirmButton.disabled = true;
            question.textContent = "⛔ Tempo esgotado!";
            feedback.textContent = `A resposta era ${correctAnswer}. A próxima pergunta vem em instantes.`;
            nextQuestionTimer = setTimeout(newQuestion, 1000);
        }
    }, 1000);
}

// ===========================
// CHECAR RESPOSTA
// ===========================
function submitAnswer() {
    if (!acceptingAnswer) return;
    const input = answer.value.trim();
    const val = Number(input);
    if (input === "" || !Number.isFinite(val)) {
        feedback.textContent = "Digite um número válido antes de confirmar.";
        answer.setAttribute("aria-invalid", "true");
        answer.focus();
        return;
    }

    acceptingAnswer = false;
    answer.disabled = true;
    confirmButton.disabled = true;
    if (val === correctAnswer) {
        score++;
        scoreDisplay.textContent = score;
        question.textContent = "✔ Correto!";
        feedback.textContent = "+1 ponto. Prepare-se para a próxima pergunta.";
    } else {
        question.textContent = `❌ Errado! (${correctAnswer})`;
        feedback.textContent = `A resposta correta é ${correctAnswer}. Tente a próxima!`;
    }

    clearInterval(interval);
    nextQuestionTimer = setTimeout(newQuestion, 700);
}

answer.addEventListener("keyup", e => {
    if (e.key === "Enter" && !e.repeat) submitAnswer();
});
confirmButton.onclick = submitAnswer;

function clearTimers() {
    clearInterval(interval);
    clearTimeout(nextQuestionTimer);
}

function stopTraining() {
    clearTimers();
    acceptingAnswer = false;
    answer.disabled = true;
    confirmButton.disabled = true;
    stopButton.disabled = true;
    timerDisplay.textContent = "0";
    question.textContent = "Treino encerrado";
    feedback.textContent = `Você fez ${score} pontos. Escolha uma operação para começar outro treino.`;
}

stopButton.onclick = stopTraining;
window.addEventListener("pagehide", stopTraining);

// ===========================
// ESCOLHER OPERAÇÃO
// ===========================
ops.forEach(btn => {
    btn.onclick = () => {
        if (!difficulty) {
            feedback.textContent = "Escolha a dificuldade primeiro e depois a operação.";
            diffs[0].focus();
            return;
        }

        selectedOp = btn.dataset.op;
        ops.forEach(button => {
            const selected = button === btn;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
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
        diffs.forEach(button => {
            const selected = button === btn;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
        diffTitle.textContent = "Dificuldade: " + difficulty.toUpperCase();

        if (selectedOp) {
            score = 0;
            scoreDisplay.textContent = "0";
            newQuestion();
        } else {
            feedback.textContent = "Agora escolha uma operação para iniciar o treino.";
        }
    };
});
