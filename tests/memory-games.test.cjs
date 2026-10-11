const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

// Minimal browser boundaries: the real game scripts own state, event handlers and timers.
function createGame(file, { unavailableStorage = false } = {}) {
  let now = 0;
  let wallOffset = 10000;
  let timerId = 0;
  const timers = new Map();
  class Element {
    constructor(tag = 'div') {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.style = { setProperty(name, value) { this[name] = value; } };
      this.attributes = {};
      this.dataset = {};
      this.listeners = {};
      this.className = '';
      this.value = '';
      this.textContent = '';
      this.disabled = false;
      this.classList = new Proxy({
        add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(' '); },
        remove: (...names) => { this.className = this.className.split(/\s+/).filter(name => !names.includes(name)).join(' '); },
        contains: name => this.className.split(/\s+/).includes(name),
      }, { get: (target, name) => /^\d+$/.test(String(name)) ? this.className.split(/\s+/)[name] : target[name] });
    }
    set textContent(value) { this.text = String(value); }
    get textContent() { return this.text; }
    set innerHTML(value) { this.children = []; }
    get firstChild() { return this.children[0]; }
    appendChild(child) {
      if (child.tagName === 'FRAGMENT') this.children.push(...child.children);
      else this.children.push(child);
      return child;
    }
    prepend(child) { this.children.unshift(child); }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name]; }
    removeAttribute(name) { delete this.attributes[name]; }
    addEventListener(name, listener) { (this.listeners[name] ||= []).push(listener); }
    fire(name, extra = {}) {
      if (name === 'click' && this.disabled) return;
      const event = { currentTarget: this, target: this, preventDefault() {}, ...extra };
      for (const listener of this.listeners[name] || []) listener(event);
      this['on' + name]?.(event);
    }
    focus() { document.activeElement = this; }
    querySelector(selector) { return selector === 'span' ? this.children[0] : null; }
    querySelectorAll(selector) { return this.children.filter(child => selector === 'button' && child.tagName === 'BUTTON'); }
  }
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  const document = {
    body: new Element('body'),
    hidden: false,
    activeElement: null,
    getElementById: get,
    createElement: tag => new Element(tag),
    createDocumentFragment: () => new Element('fragment'),
    querySelector: selector => get(selector),
    querySelectorAll: selector => {
      const all = [...elements.values()].flatMap(el => el.children);
      return all.filter(el => el.classList.contains(selector.slice(1)));
    },
    listeners: {},
    addEventListener(name, listener) { (this.listeners[name] ||= []).push(listener); },
    fire(name, event = {}) { for (const listener of this.listeners[name] || []) listener(event); },
  };
  get('dificuldade').value = 'facil';
  get('.game-box').appendChild(new Element('span'));
  get('attempts').textContent = '0';
  const setTimeout = (fn, delay = 0) => { const id = ++timerId; timers.set(id, { fn, at: now + delay }); return id; };
  const window = {
    listeners: {},
    setTimeout,
    clearTimeout: id => timers.delete(id),
    addEventListener(name, listener) { (this.listeners[name] ||= []).push(listener); },
    fire(name) { for (const listener of this.listeners[name] || []) listener(); },
  };
  const stored = new Map();
  const localStorage = {
    getItem(key) { if (unavailableStorage) throw new Error('Storage unavailable'); return stored.get(key) ?? null; },
    setItem(key, value) { if (unavailableStorage) throw new Error('Storage unavailable'); stored.set(key, String(value)); },
  };
  const math = Object.create(Math);
  math.random = () => 0;
  const context = vm.createContext({
    document, window, localStorage, Math: math,
    Date: { now: () => now + wallOffset },
    performance: { now: () => now },
    setTimeout, clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => { fn(now); return 0; },
    location: { reload() { throw new Error('Reload discards selected difficulty'); } },
  });
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  function advance(ms) {
    const end = now + ms;
    while (true) {
      const pending = [...timers.entries()].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!pending) break;
      now = pending[1].at;
      timers.delete(pending[0]);
      pending[1].fn();
    }
    now = end;
  }
  return { get, document, window, advance, stored, run: code => vm.runInContext(code, context), shiftWallClock: amount => { wallOffset += amount; } };
}

const memoryScript = 'pages/Jogos/JogoDaMemoria/JSdoJOGOdaMemoria.js';
const visualScript = 'pages/Jogos/MemoriaVisual/JSdoJOGOdaMemoriaVisual.js';
const reactionScript = 'pages/Jogos/Tempo de Reação/JSdoTempoDeReação.js';

test('memory: switching difficulty cancels a pending mismatch before accepting new cards', () => {
  const game = createGame(memoryScript);
  game.window.fire('load');
  const cards = game.get('.grid').children;
  cards[0].fire('click');
  cards.find(card => card.getAttribute('data-linguagem') !== cards[0].getAttribute('data-linguagem')).fire('click');
  game.get('dificuldade').value = 'medio';
  game.get('dificuldade').fire('change');
  const nextCard = game.get('.grid').children[0];
  nextCard.fire('click');
  assert.doesNotThrow(() => game.advance(600));
  assert.equal(nextCard.classList.contains('revelarCard'), true);
});

test('memory: every hard-mode language has a readable card image on a case-sensitive filesystem', () => {
  const game = createGame(memoryScript);
  game.get('dificuldade').value = 'dificil';
  game.window.fire('load');
  for (const card of game.get('.grid').children) {
    const asset = card.firstChild.style.backgroundImage.match(/url\('(.+)'\)/)[1];
    assert.equal(fs.existsSync(path.resolve(root, 'pages/Jogos/JogoDaMemoria', asset)), true, asset);
  }
});

test('visual memory: exhausting lives immediately blocks additional mistakes and a racing win', () => {
  const game = createGame(visualScript);
  game.get('startButton').fire('click');
  game.advance(1150);
  game.run('handleSquareClick(8); handleSquareClick(8); handleSquareClick(8);');
  assert.equal(game.run('lives'), 0);
  game.run('handleSquareClick(0); handleSquareClick(1); handleSquareClick(2); handleSquareClick(3);');
  game.advance(650);
  assert.equal(game.run('level'), 1);
  assert.equal(game.run('acceptingInput'), false);
});

test('visual memory: blocked browser storage does not prevent starting and completing a level', () => {
  let game;
  assert.doesNotThrow(() => { game = createGame(visualScript, { unavailableStorage: true }); });
  game.get('startButton').fire('click');
  game.advance(1150);
  game.run('handleSquareClick(0); handleSquareClick(1); handleSquareClick(2); handleSquareClick(3);');
  assert.doesNotThrow(() => game.advance(650));
  assert.equal(game.run('level'), 2);
});

test('reaction: elapsed results remain correct when the system clock moves backwards', () => {
  const game = createGame(reactionScript);
  game.get('.game-box').fire('click');
  game.advance(1500);
  game.shiftWallClock(-5000);
  game.advance(175);
  game.get('.game-box').fire('click');
  assert.equal(game.get('best-time').textContent, '175');
  assert.equal(game.get('attempts').textContent, '1');
});

test('reaction: hiding the page cancels the attempt without adding a misleading result', () => {
  const game = createGame(reactionScript);
  game.get('.game-box').fire('click');
  game.document.hidden = true;
  game.document.fire('visibilitychange');
  game.advance(4000);
  assert.equal(game.get('.game-box').classList.contains('ready'), false);
  assert.equal(game.get('attempts').textContent, '0');
});

test('memory: restart clears the current pair and preserves the selected difficulty', () => {
  const game = createGame(memoryScript);
  game.get('dificuldade').value = 'medio';
  game.window.fire('load');
  game.get('.grid').children[0].fire('click');
  game.get('btnNovaPartida').fire('click');
  assert.equal(game.get('dificuldade').value, 'medio');
  assert.equal(game.get('.grid').children.length, 20);
  assert.equal(game.run('primeiraCarta'), '');
  assert.equal(game.get('.grid').children.some(card => card.classList.contains('revelarCard')), false);
});

test('memory: card names are exposed only while revealed and concealed again after a mismatch', () => {
  const game = createGame(memoryScript);
  game.window.fire('load');
  const first = game.get('.grid').children[0];
  const second = game.get('.grid').children.find(card => card.getAttribute('data-linguagem') !== first.getAttribute('data-linguagem'));
  assert.equal(first.tagName, 'BUTTON');
  const hiddenLabel = first.getAttribute('aria-label');
  assert.ok(hiddenLabel);
  first.fire('click');
  assert.notEqual(first.getAttribute('aria-label'), hiddenLabel);
  second.fire('click');
  game.advance(600);
  assert.equal(first.getAttribute('aria-label'), hiddenLabel);
});

test('memory: completing the board focuses the dialog and Escape returns to restart', () => {
  const game = createGame(memoryScript);
  game.window.fire('load');
  const pairs = new Map();
  for (const card of game.get('.grid').children) {
    const key = card.getAttribute('data-linguagem');
    if (!pairs.has(key)) pairs.set(key, []);
    pairs.get(key).push(card);
  }
  for (const cards of pairs.values()) for (const card of cards) card.fire('click');
  assert.equal(game.document.activeElement, game.get('btnReiniciar'));
  game.document.fire('keydown', { key: 'Escape', preventDefault() {} });
  assert.equal(game.get('modalFimDeJogo').classList.contains('show'), false);
  assert.equal(game.document.activeElement, game.get('btnNovaPartida'));
});

test('visual memory: keyboard controls stay disabled during memorization and expose selected state', () => {
  const game = createGame(visualScript);
  game.get('startButton').fire('click');
  const square = game.get('gridContainer').children[0];
  assert.equal(square.tagName, 'BUTTON');
  assert.equal(square.disabled, true);
  game.advance(1150);
  assert.equal(square.disabled, false);
  square.fire('click');
  assert.equal(square.getAttribute('aria-pressed'), 'true');
  square.fire('click');
  assert.equal(square.getAttribute('aria-pressed'), 'false');
});

test('reaction: a held keyboard key does not auto-repeat into an early attempt', () => {
  const game = createGame(reactionScript);
  let prevented = false;
  game.get('.game-box').fire('keydown', { key: 'Enter', repeat: true, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
});
