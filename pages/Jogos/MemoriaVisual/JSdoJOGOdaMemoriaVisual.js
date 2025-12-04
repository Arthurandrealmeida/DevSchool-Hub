
const SHOW_TIME_MS = 900;    // Define o tempo em milissegundos que os quadrados corretos ficam acesos (900ms = 0.9 segundos).
const PAUSE_AFTER_SHOW = 250; // pequena pausa antes do input (reduzido p/ sensação mais rápida)

let level = 1; //Variável que rastreia o nível atual.
let lives = 2; //Variável que rastreia a vida atual.

let targetSet = new Set(); //armazena os índices dos quadrados que o jogador deve clicar para vencer o nível. Exemplo: Se o jogo escolheu o quadrado 3 e o 7 para acender, o targetSet será: {3, 7}.

let userSet = new Set(); //O userSet armazena os índices dos quadrados que o jogador clicou. Quando o jogador clica em um quadrado, o código adiciona o índice ao userSet usando userSet.add(índice). o JavaScript compara se o userSet é exatamente igual ao targetSet para determinar se o jogador venceu o nível.

let acceptingInput = false; //quando o jogo está na fase de memorização, o valor é false. Isso impede que o jogador clique nos quadrados antes da hora. Quando a fase de memorização termina, o código muda a flag para true e agora o jogador pode clicar. Uso em handleSquareClick(index)

let isAnimating = false; //Quando o tabuleiro está acendendo a sequência (o SHOW_TIME_MS), a variável isAnimating é definida como true. Assim como acceptingInput, ela também é usada para bloquear cliques e outras ações enquanto o jogo está exibindo a sequência. O código usa a condição if (!acceptingInput || isAnimating) return; para garantir que o jogador não possa clicar nem durante a exibição nem durante o breve intervalo de transição entre a exibição e o início da jogada.

let bestLevel = localStorage.getItem("bestLevel") || 0; // Esta linha tenta recuperar o valor do seu recorde salvo no navegador. localStorage.getItem("bestLevel") busca o dado associado à chave "bestLevel".Se este for o primeiro acesso (e nada foi salvo ainda), o resultado é null. O operador || 0 (OR Lógico) garante que, se for null ou indefinido, a variável bestLevel comece com o valor 0
document.getElementById("best-level").textContent = bestLevel; //Após carregar o valor (seja o recorde salvo ou 0), esta linha busca o elemento HTML com o ID "best-level" e define seu conteúdo de texto para exibir o recorde na tela do jogo.



function updateBestLevel() { //Esta função é chamada pelo jogo a cada nível que o jogador completa com sucesso. 

    if (level > bestLevel) { //Esta condição verifica se o nível atual que o jogador alcançou (level) é maior que o valor do recorde salvo (bestLevel). A função só procede se for, de fato, um novo recorde.

        bestLevel = level; //Se a condição for verdadeira, o novo recorde é atribuído à variável bestLevel

        localStorage.setItem("bestLevel", bestLevel); //Esta é a linha que efetivamente salva o novo recorde no seu navegador, garantindo que ele não será perdido mesmo após o fechamento da página.

        document.getElementById("best-level").textContent = bestLevel; //Atualização de Visual
    }
}
// DOM cache

const levelEl = document.getElementById("level");
const livesEl = document.getElementById("lives");
const statusText = document.getElementById("statusText");
const startBtn = document.getElementById("startButton");
const startBtnContainer = document.getElementById("startButtonContainer");
const gridContainer = document.getElementById("gridContainer");
const gameBoard = document.getElementById("gameBoard");
const errorContainer = document.getElementById("errorContainer");

startBtn.addEventListener("click", () => {
  startBtnContainer.style.display = "none";
  startGame();
});

// -----------------------------
// Game flow
// -----------------------------
function startGame() {
  level = 1;
  lives = 2;
  updateLivesDisplay();
  updateLevelDisplay();
  startLevel();
}

function startLevel() {
  // block input while grid builds/animates
  acceptingInput = false;
  isAnimating = true;
  userSet.clear();
  clearGridHighlights();
  updateLevelDisplay();
  updateLivesDisplay();

  buildGridForLevel();

  // after building grid, create target set & show it
  const totalSquares = gridContainer.children.length;
  const numToShow = Math.min(totalSquares, 3 + level);
  targetSet = generateUniqueSet(numToShow, totalSquares);

  statusText.textContent = "Memorize os quadrados...";
  gameBoard.style.display = "block";
  errorContainer.style.display = "none";

  // Use rAF before DOM reads/writes to ensure paint happens predictably
  requestAnimationFrame(() => {
    highlightSetFast(targetSet, "active-showing");

    // keep showing for SHOW_TIME_MS then clear (use rAF to remove classes)
    window.setTimeout(() => {
      // schedule removal on next frame for smoothness
      requestAnimationFrame(() => {
        clearGridHighlights();

        // short pause then accept input
        window.setTimeout(() => {
          acceptingInput = true;
          isAnimating = false;
          statusText.textContent = "Agora é sua vez!";
          updateSelectable(true);
        }, PAUSE_AFTER_SHOW);
      });
    }, SHOW_TIME_MS);
  });
}

// -----------------------------
// Grid build (optimized)
// -----------------------------
function buildGridForLevel() {
  // clear fast
  gridContainer.innerHTML = "";

  const cols = 3 + Math.floor(level / 2);
  const rows = cols;
  const total = cols * rows;

  // set columns in one write
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // build via fragment to avoid reflow per element
  const frag = document.createDocumentFragment();
  for (let i = 0; i < total; i++) {
    const sq = document.createElement("div");
    sq.className = "grid-square";
    sq.dataset.index = i;
    // lightweight handler (arrow capturing index)
    sq.addEventListener("click", () => handleSquareClick(i));
    frag.appendChild(sq);
  }
  // controles de tamanho baseados no número de colunas
let squareSize;

if (cols <= 4) squareSize = "90px"; 
else if (cols === 5) squareSize = "75px";
else if (cols === 6) squareSize = "62px";
else if (cols === 7) squareSize = "54px";
else if (cols === 8) squareSize = "48px";
else squareSize = "42px"; // grades muito grandes

gridContainer.style.setProperty("--square-size", squareSize);

  gridContainer.appendChild(frag);
}

// -----------------------------
// Utilities (fast)
// -----------------------------
function generateUniqueSet(count, total) {
  const available = Array.from({ length: total }, (_, i) => i);
  const set = new Set();
  for (let i = 0; i < count && available.length > 0; i++) {
    const r = Math.floor(Math.random() * available.length);
    set.add(available[r]);
    available.splice(r, 1);
  }
  return set;
}

// fast highlight: only add class (no reads)
function highlightSetFast(set, className) {
  // iterate over set rather than children to touch fewer nodes
  for (const idx of set) {
    const el = gridContainer.children[idx];
    if (el) el.classList.add(className);
  }
}

// clear highlights quickly (loop once)
function clearGridHighlights() {
  const children = gridContainer.children;
  for (let i = 0, len = children.length; i < len; i++) {
    const el = children[i];
    // remove known classes — fewer tokens than replace
    el.classList.remove("active-showing", "active-clicked", "active-wrong", "disabled");
  }
}

// enable/disable clicks visually
function updateSelectable(enable) {
  const children = gridContainer.children;
  for (let i = 0, len = children.length; i < len; i++) {
    const el = children[i];
    if (enable) el.classList.remove("disabled");
    else el.classList.add("disabled");
  }
}

// -----------------------------
// Click handling
// -----------------------------
function handleSquareClick(index) {
  if (!acceptingInput || isAnimating) return;

  const el = gridContainer.children[index];
  if (!el) return;

  // if already selected, ignore duplicates (or allow toggle - here we allow toggle)
  if (userSet.has(index)) {
    userSet.delete(index);
    el.classList.remove("active-clicked");
    return;
  }

  // wrong click quickly handled
  if (!targetSet.has(index)) {
    wrongClickFeedback(el);
    return;
  }

  // correct click
  userSet.add(index);
  // use rAF to add class so browser batches paint
  requestAnimationFrame(() => el.classList.add("active-clicked"));

  // if collected all, evaluate
  if (userSet.size === targetSet.size) {
    acceptingInput = false;
    // short timeout to feel responsive but avoid long waits
    window.setTimeout(() => evaluateAttempt(), 150);
  }
}

// -----------------------------
// Wrong click (lives) - optimized
// -----------------------------
function wrongClickFeedback(el) {
  // immediate visual: add class (fast)
  el.classList.add("active-wrong");

  // decrement life
  lives--;
  updateLivesDisplay();

  // remove the wrong highlight after short time
  window.setTimeout(() => {
    // use rAF to remove class
    requestAnimationFrame(() => el.classList.remove("active-wrong"));
  }, 600);

  if (lives <= 0) {
    // give a tiny pause so player sees last effect
    window.setTimeout(() => gameOver(), 650);
  }
}

// -----------------------------
// Evaluation & flow
// -----------------------------
function evaluateAttempt() {
    const correct = setsEqual(userSet, targetSet);
    
    // O bloco IF começa aqui
    if (correct) {
    statusText.textContent = "Correto!";
    flashCorrectFeedback();

    // leve atraso pra UX
    window.setTimeout(() => {
        // 1. Limpa o flash de acerto que estava visível por 500ms
        clearGridHighlights(); // <--- NOVO LOCAL DA LIMPEZA

        // 2. Prepara o novo nível
        level++;
        updateBestLevel(); 
        
        userSet.clear();
        updateLevelDisplay();
        
        // 3. Inicia a próxima rodada (que agora não limpa a grade duas vezes)
        startLevel();
    }, 500);

    // O bloco IF termina aqui, e o ELSE começa imediatamente
    } else {
        // penalize
        lives--;
        updateLivesDisplay();

        showCorrectOnWrong();

        if (lives <= 0) {
            window.setTimeout(() => gameOver(), 700);
            return;
        }

        // restart same or next? here we restart same level quickly
        window.setTimeout(() => {
            userSet.clear();
            clearGridHighlights();
            startLevel();
        }, 700);
    }
}

function gameOver() {
  statusText.textContent = "Você errou 2 vezes — reiniciando...";
  showCorrectOnWrong();

  window.setTimeout(() => {
    startBtnContainer.style.display = "block";
    gameBoard.style.display = "none";
    level = 1;
    lives = 2;
    userSet.clear();
    targetSet.clear();
    clearGridHighlights();
    updateLevelDisplay();
    updateLivesDisplay();
  }, 900);
}

// helpers
function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function showCorrectOnWrong() {
  const children = gridContainer.children;
  for (let i = 0, len = children.length; i < len; i++) {
    const el = children[i];
    el.classList.remove("active-clicked");
    el.classList.add("disabled");
    if (targetSet.has(i)) el.classList.add("active-wrong");
  }
}

function flashCorrectFeedback() {
    // DESABILITA INPUT E HOVER ENQUANTO FAZ O FLASH
    updateSelectable(false);

    for (const i of targetSet) {
        const el = gridContainer.children[i];
        if (el) el.classList.add("active-showing");
    }
    // Agora, a limpeza (clearGridHighlights) e o startLevel() cuidarão do estado.
}

// HUD
function updateLevelDisplay() {
  levelEl.textContent = level;
}
function updateLivesDisplay() {
  if (livesEl) livesEl.textContent = `Vidas: ${lives}`;
}

// init
(function init() {
  gameBoard.style.display = "none";
  errorContainer.style.display = "none";
  updateLevelDisplay();
  updateLivesDisplay();
})();