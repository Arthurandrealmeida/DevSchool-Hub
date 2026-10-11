document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('mode-modal');
  const layout = document.querySelector('.layout');
  const computer = document.getElementById('mode-computer');
  const local = document.getElementById('mode-1v1');
  const controls = document.getElementById('controls');
  const level = document.getElementById('bot-level');
  const color = document.getElementById('bot-color');
  const auto = document.getElementById('bot-auto');
  const play = document.getElementById('bot-play');
  const status = document.getElementById('chess-status');
  const board = document.getElementById('board');
  let thinking = false;
  let engineUnavailable = false;

  function updateStatus() {
    if (window.gameOver) status.textContent = 'Partida encerrada. Inicie uma nova partida para jogar novamente.';
    else if (thinking) status.textContent = 'O computador está pensando…';
    else if (engineUnavailable) status.textContent = 'O computador não respondeu. Escolha outro nível ou inicie uma nova partida.';
    else status.textContent = `Vez das ${turnoAtual === 'white' ? 'brancas' : 'pretas'}.`;
  }

  function chooseMode(mode) {
    window.gameMode = mode;
    window.playerColor = mode === 'computer' ? (color.value === 'white' ? 'black' : 'white') : null;
    controls.style.display = mode === 'computer' ? 'flex' : 'none';
    document.getElementById('bot-buttons').style.display = 'none';
    auto.checked = mode === 'computer';
    modal.style.display = 'none';
    layout.inert = false;
    board.querySelector('[data-coord="e2"]')?.focus();
    updateStatus();
  }

  computer.addEventListener('click', () => chooseMode('computer'));
  local.addEventListener('click', () => chooseMode('1v1'));
  color.addEventListener('change', () => {
    window.playerColor = color.value === 'white' ? 'black' : 'white';
    resetarSelecao();
    engineUnavailable = false;
    updateStatus();
  });
  level.addEventListener('change', () => { engineUnavailable = false; updateStatus(); });

  async function playComputer() {
    if (thinking || engineUnavailable || window.gameOver || turnoAtual !== color.value || modal.style.display !== 'none') return;
    thinking = true;
    level.disabled = color.disabled = play.disabled = true;
    updateStatus();
    try {
      if (typeof window.playBot !== 'function') throw new Error('Engine unavailable');
      engineUnavailable = !await window.playBot(Number(level.value), color.value);
    } catch {
      engineUnavailable = true;
    } finally {
      thinking = false;
      level.disabled = color.disabled = play.disabled = false;
      updateStatus();
    }
  }

  play.addEventListener('click', playComputer);
  setInterval(() => {
    if (auto.checked) void playComputer();
    updateStatus();
  }, 700);

  const names = { pawn: 'Peão', rook: 'Torre', knight: 'Cavalo', bishop: 'Bispo', queen: 'Rainha', king: 'Rei' };
  const squares = [...board.querySelectorAll('.casa')];
  function labelSquares() {
    squares.forEach(square => {
      const piece = square.querySelector('.peca');
      const description = piece ? `${names[piece.dataset.tipo] || 'Peça'} das ${piece.dataset.cor === 'white' ? 'brancas' : 'pretas'}` : 'Casa vazia';
      square.setAttribute('aria-label', `${square.dataset.coord}: ${description}`);
      if (piece) piece.alt = description;
    });
  }
  squares.forEach(square => {
    square.setAttribute('role', 'button');
    square.tabIndex = 0;
  });
  labelSquares();
  new MutationObserver(() => { labelSquares(); updateStatus(); }).observe(board, { childList: true, subtree: true });
  board.addEventListener('click', updateStatus);
  board.addEventListener('keydown', event => {
    const square = event.target.closest('.casa');
    if (!square) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); square.click(); }
    const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -8, ArrowDown: 8 }[event.key];
    if (offset) {
      event.preventDefault();
      const index = squares.indexOf(square);
      const next = index + offset;
      if (next >= 0 && next < 64 && (Math.abs(offset) === 8 || Math.floor(index / 8) === Math.floor(next / 8))) squares[next].focus();
    }
  });

  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); chooseMode('1v1'); }
    if (event.key === 'Tab') {
      event.preventDefault();
      (document.activeElement === computer ? local : computer).focus();
    }
  });
  modal.style.display = 'flex';
  layout.inert = true;
  computer.focus();
});
