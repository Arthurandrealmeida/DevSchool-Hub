// ============================
// ELEMENTOS
// ============================
const screenIdle = document.getElementById("screen-idle");
const screenPlaying = document.getElementById("screen-playing");
const screenGameOver = document.getElementById("screen-gameover");

const btnStart = document.getElementById("btn-start");
const btnReset = document.getElementById("btn-reset");
const btnRestart = document.getElementById("btn-restart");
const btnRestartGameOver = document.getElementById("btn-reset-gameover")
const btnHint = document.getElementById("btn-hint");

const codeDisplay = document.getElementById("code-display");
const hintBox = document.getElementById("hint-box");
const hintText = document.getElementById("hint-text");

const statLevel = document.getElementById("stat-level");
const statScore = document.getElementById("stat-score");
const statStreak = document.getElementById("stat-streak");
const statTime = document.getElementById("stat-time");
const timeProgress = document.getElementById("time-progress");

const finalScore = document.getElementById("final-score");
const finalLevel = document.getElementById("final-level");
const hintsUsedText = document.getElementById("hints-used");
const feedback = document.getElementById("answer-feedback");

let index = 0;
let score = 0;
let streak = 0;
let timer;
let transitionTimer;
let playing = false;
let questionLocked = false;
let currentChallenge;
let hintsUsed = 0;
let challenges = [];



// ============================
// FUNÇÃO SHUFFLE
// ============================

let gameMode = "medium"; // easy | medium | hard

const modeButtons = document.querySelectorAll(".mode-btn");

modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        modeButtons.forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        gameMode = btn.classList.contains("easy") ? "easy" :
                   btn.classList.contains("medium") ? "medium" :
                   "hard";
    });
});

const modeSettings = {
    easy: {
        time: 90,
        baseScore: 5,
        hintPenalty: 0
    },
    medium: {
        time: 60,
        baseScore: 10,
        hintPenalty: 5
    },
    hard: {
        time: 40,
        baseScore: 15,
        hintPenalty: 10
    }
};



function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// ============================
// DESAFIOS
// ============================
const challengesByMode = {
    easy: [
        {
            title: "Print básico",
            description: "O que corrige este código?",
            code: `
print "Olá mundo"
            `,
            options: [
                "Adicionar parênteses no print",
                "Trocar print por echo",
                "Adicionar dois pontos",
                "Remover aspas"
            ],
            correct: 0,
            hint: "Desde o Python 3, print usa parênteses."
        },
        {
            title: "Soma simples",
            description: "Como somar os valores e imprimir o número 8?",
            code: `
x = 5
y = "3"
print(x + y)
            `,
            options: [
                "Converter y para número",
                "Converter x para string",
                "Trocar print por alert",
                "Usar vírgula"
            ],
            correct: 0,
            hint: "Não se soma número com texto."
        },
        {
            title: "If simples",
            description: "O que está errado?",
            code: `
x = 10
if x > 5
    print("maior")
            `,
            options: [
                "Falta dois pontos no if",
                "Falta ponto e vírgula",
                "Falta declarar x",
                "Erro no print"
            ],
            correct: 0,
            hint: "O if precisa de um caractere no final."
        }
    ],

    medium: [
        {
            title: "Comparação errada",
            description: "O que corrige o erro?",
            code: `
x = 10
if x = 10:
    print("igual")
            `,
            options: [
                "Trocar = por ==",
                "Trocar if por while",
                "Remover x",
                "Trocar print"
            ],
            correct: 0,
            hint: "Comparação não é atribuição."
        },
        {
            title: "Laço infinito",
            description: "Como exibir todos os números de 0 a 4 e terminar o laço?",
            code: `
i = 0
while i < 5:
    print(i)
            `,
            options: [
                "Adicionar i += 1",
                "Trocar a condição por i < 10",
                "Colocar break",
                "Trocar 5 por 10"
            ],
            correct: 0,
            hint: "O contador nunca muda."
        },
        {
            title: "Erro de lista",
            description: "Como imprimir o último valor (3) sem alterar a lista?",
            code: `
lista = [1,2,3]
print(lista[3])
            `,
            options: [
                "Trocar 3 por 2",
                "Transformar lista em tupla",
                "Adicionar número 4",
                "Usar pop"
            ],
            correct: 0,
            hint: "O índice começa no zero."
        }
    ],

    hard: [
        {
            title: "Função sem retorno",
            description: "Qual é o problema?",
            code: `
def somar(a, b):
    a + b
print(somar(2,3))
            `,
            options: [
                "Falta return",
                "Erro no print",
                "Erro na chamada",
                "Erro nos parâmetros"
            ],
            correct: 0,
            hint: "A função não devolve nada."
        },
        {
            title: "Escopo de variável",
            description: "O que causa erro?",
            code: `
def teste():
    x = 10
teste()
print(x)
            `,
            options: [
                "x só existe dentro da função",
                "Falta return",
                "Erro no print",
                "Erro no def"
            ],
            correct: 0,
            hint: "Variáveis têm escopo."
        },
        {
            title: "Lista mutável",
            description: "O que acontece ao rodar?",
            code: `
a = [1,2,3]
b = a
b.append(4)
print(a)
            `,
            options: [
                "a também muda",
                "a não muda",
                "Erro de sintaxe",
                "b vira cópia"
            ],
            correct: 0,
            hint: "Listas são referências."
        }
    ]
};


// ============================
// EMBARALHAR ALTERNATIVAS E ATUALIZAR 'correct'
// ============================
function processChallenge(ch) {
    const originalOptions = [...ch.options];
    const correctText = originalOptions[ch.correct];

    const shuffled = shuffle(originalOptions);
    const newCorrectIndex = shuffled.indexOf(correctText);

    return {
        ...ch,
        options: shuffled,
        correct: newCorrectIndex
    };
}

challenges = challenges.map(processChallenge);

// ============================
// MOSTRAR DESAFIO
// ============================
function loadChallenge() {
    currentChallenge = challenges[index];
    questionLocked = false;
    btnHint.disabled = false;
    feedback.textContent = "";

    statLevel.textContent = index + 1;

    codeDisplay.innerText = currentChallenge.code.trim();
    document.getElementById("challenge-title").innerText = currentChallenge.title;
    document.getElementById("challenge-description").innerText = currentChallenge.description;

    hintBox.classList.add("hidden");

    renderOptions();
}

// ============================
// CAIXA DE MÚLTIPLA ESCOLHA
// ============================
function renderOptions() {
    const quizHTML = `
        <div class="quiz">
            <h3 class="quiz-title">Escolha uma resposta</h3>
            <div class="quiz-options">
                ${currentChallenge.options
                    .map((opt, i) => `<button type="button" class="quiz-option" data-index="${i}">${opt}</button>`)
                    .join("")}
            </div>
        </div>
    `;

    // APAGA TODAS AS QUIZZES ANTES DE COLOCAR A PRÓXIMA
    document.querySelectorAll(".quiz").forEach(el => el.remove());

    // INSERE A NOVA LOGO ABAIXO DO CÓDIGO
    codeDisplay.insertAdjacentHTML("afterend", quizHTML);

    // EVENTOS
    document.querySelectorAll(".quiz-option").forEach(op => {
        op.addEventListener("click", handleAnswer);
    });
    document.querySelector(".quiz-option")?.focus();
}

// ============================
// VERIFICAR RESPOSTA
// ============================
function handleAnswer(e) {

    if (!playing || questionLocked) return;

    const element = e.currentTarget;
    const i = Number(element.dataset.index);

    // evita duplo clique no MESMO elemento
    if (element.dataset.clicked === "true") return;
    element.dataset.clicked = "true";
    element.disabled = true;

    let earned = 0;

    if (i === currentChallenge.correct) {
        questionLocked = true;
        clearInterval(timer);
        btnHint.disabled = true;
        // desativa todas as opções quando acertar (impede múltiplos envios)
        document.querySelectorAll(".quiz-option").forEach(op => {
            op.disabled = true;
            op.dataset.clicked = "true";
        });

        element.classList.add("correct");

        // Pontuação básica
        earned += modeSettings[gameMode].baseScore;

        // Bonus por tempo (se o timer estiver acima de 40s)
        const currentTime = Number(statTime.textContent);
        if (currentTime > 40) {
            earned += 10;
        }

        // Bonus por streak
        streak++;
        if (streak === 3) earned += 10;
        if (streak === 5) earned += 20;

        // Penalidade se usou dica nessa questão
        if (!hintBox.classList.contains("hidden")) {
        earned -= modeSettings[gameMode].hintPenalty;
        }

        // Não deixar pontuação negativa
        earned = Math.max(0, earned);

        // Soma final
        score += earned;

        statScore.textContent = score;
        statStreak.textContent = streak;
        feedback.textContent = `Correto! +${earned} pontos. ${currentChallenge.hint}`;

        transitionTimer = setTimeout(nextChallenge, 600);
    } else {
        element.classList.add("wrong");
        streak = 0;
        statStreak.textContent = 0;
        feedback.textContent = "Essa opção não resolve o desafio. Tente outra ou use uma dica.";
        // aqui NÃO desativamos as outras opções: o jogador pode tentar novamente em outra opção
    }
}


// ============================
// PRÓXIMO DESAFIO
// ============================
function nextChallenge() {
    if (!playing) return;
    clearGameTimers();
    const quiz = document.querySelector(".quiz");
    if (quiz) quiz.remove();

    index++;

    if (index >= challenges.length) {
        endGame();
        return;
    }

    hintBox.classList.add("hidden");
    hintText.textContent = "";

    loadChallenge();
    resetTimer();
}


// ============================
// TIMER
// ============================
function resetTimer() {
    clearInterval(timer);

    let total = modeSettings[gameMode].time;
    let remaining = total;

    statTime.textContent = remaining;
    timeProgress.style.width = "100%";

    timer = setInterval(() => {
        remaining--;
        statTime.textContent = remaining;
        timeProgress.style.width = (remaining / total) * 100 + "%";

        if (remaining <= 0) {
            clearInterval(timer);
            questionLocked = true;
            btnHint.disabled = true;
            streak = 0;
            statStreak.textContent = "0";
            document.querySelectorAll(".quiz-option").forEach((option, i) => {
                option.disabled = true;
                if (i === currentChallenge.correct) option.classList.add("correct");
            });
            feedback.textContent = `Tempo esgotado. Resposta: ${currentChallenge.options[currentChallenge.correct]}. ${currentChallenge.hint}`;
            transitionTimer = setTimeout(nextChallenge, 1600);
        }
    }, 1000);
}


// ============================
// INICIAR JOGO
// ============================
function startGame() {
    clearGameTimers();
    playing = true;
    screenIdle.classList.add("hidden");
    screenGameOver.classList.add("hidden");
    screenPlaying.classList.remove("hidden");

    score = 0;
    streak = 0;
    index = 0;
    hintsUsed = 0;

    statScore.textContent = "0";
    statStreak.textContent = "0";

    // 🔥 AQUI O JOGO PEGA OS DESAFIOS DO MODO CERTO
    challenges = shuffle(challengesByMode[gameMode]).map(processChallenge);

    hintBox.classList.add("hidden");
    hintText.textContent = "";

    loadChallenge();
    resetTimer();
}


btnStart.onclick = startGame;

function clearGameTimers() {
    clearInterval(timer);
    clearTimeout(transitionTimer);
}

function returnToMenu() {
    playing = false;
    questionLocked = true;
    clearGameTimers();
    screenPlaying.classList.add("hidden");
    screenGameOver.classList.add("hidden");
    screenIdle.classList.remove("hidden");
    btnStart.focus();
}

btnReset.onclick = returnToMenu;
// Reinicia o jogo a partir da tela de Game Over
btnRestart.onclick = startGame;

btnRestartGameOver.onclick = returnToMenu;



// ============================
// DICA
// ============================
btnHint.onclick = () => {
    if (!playing || questionLocked || !currentChallenge) return;

    if (!hintBox.classList.contains("hidden")) return;

    hintsUsed++;
    hintText.textContent = currentChallenge.hint;
    hintBox.classList.remove("hidden");
};




// ============================
// GAME OVER
// ============================
function endGame() {
    playing = false;
    questionLocked = true;
    clearGameTimers();

    screenPlaying.classList.add("hidden");
    screenGameOver.classList.remove("hidden");

    finalScore.textContent = score;
    finalLevel.textContent = index;
    hintsUsedText.textContent = `Você usou ${hintsUsed} dicas durante o jogo.`;
    btnRestart.focus();
}

window.addEventListener("pagehide", returnToMenu);
