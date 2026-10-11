const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// The games are standalone browser scripts. Keep their logic real and replace
// only DOM/timer/CDN boundaries so regressions can run without dependencies.
class Element {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.children = []; this.listeners = {};
    this.className = ''; this.style = {}; this.dataset = {}; this.textContent = '';
    this.value = ''; this.disabled = false;
    this.classList = {
      add: (...names) => { this.className = [...new Set([...this.className.split(' ').filter(Boolean), ...names])].join(' '); },
      remove: (...names) => { this.className = this.className.split(' ').filter(n => !names.includes(n)).join(' '); },
      contains: name => this.className.split(' ').includes(name),
      toggle: (name, force) => { const add = force ?? !this.classList.contains(name); this.classList[add ? 'add' : 'remove'](name); return add; }
    };
  }
  set innerHTML(value) {
    this.children.forEach(child => { child.parentNode = null; }); this.children = [];
    if (value.includes('placeholder')) { const child = new Element('p'); child.className = 'placeholder'; this.appendChild(child); }
    if (value.includes('nivelSelect')) { const child = new Element('select'); child.id = 'nivelSelect'; this.appendChild(child); }
  }
  get innerHTML() { return ''; }
  get firstChild() { return this.children[0] || null; }
  get lastChild() { return this.children.at(-1) || null; }
  get parentElement() { return this.parentNode; }
  get nextSibling() { return this.parentNode?.children[this.parentNode.children.indexOf(this) + 1] || null; }
  appendChild(child) { return this.insertBefore(child, null); }
  insertBefore(child, before) {
    if (!child) throw new TypeError('Cannot insert a null word');
    if (child === before) return child;
    child.remove(); child.parentNode = this;
    const index = before ? this.children.indexOf(before) : this.children.length;
    this.children.splice(index, 0, child); return child;
  }
  removeChild(child) { child.remove(); return child; }
  remove() { if (this.parentNode) { this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1); this.parentNode = null; } }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  dispatch(type, event = {}) {
    event.target ||= this; event.preventDefault ||= () => { event.defaultPrevented = true; };
    this['on' + type]?.(event); for (const fn of this.listeners[type] || []) fn(event);
    return event;
  }
  click() { if (!this.disabled) this.dispatch('click'); }
  setAttribute(name, value) { this[name] = String(value); }
  focus() {
    let root = this;
    while (root.parentNode) root = root.parentNode;
    root.activeElement = this;
  }
  closest(selector) { return selector.split(',').some(s => s.trim().toUpperCase() === this.tagName || s.trim() === '[contenteditable="true"]' && this.isContentEditable) ? this : null; }
  getBoundingClientRect() { return { left: 0, width: 100, height: 100 }; }
  querySelectorAll(selector) {
    const matches = el => selector.startsWith('.') ? el.classList.contains(selector.slice(1)) : el.id === selector.slice(1);
    return this.children.flatMap(child => [...(matches(child) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

function loadGame(relativePath, ids, geo = false) {
  const document = new Element();
  document.createElement = tag => new Element(tag);
  document.getElementById = id => document.querySelector('#' + id);
  const content = new Element('main'); content.className = 'content'; document.appendChild(content);
  ids.forEach(id => { const el = new Element(); el.id = id; content.appendChild(el); });
  const timers = new Map(); let clock = 0; let timerId = 0;
  const mapEvents = {};
  const selection = new Proxy({}, { get: (_, key) => key === 'node' ? () => content : key === 'on' ? (name, fn) => { mapEvents[name] = fn; return selection; } : () => selection });
  const window = new Element();
  const context = vm.createContext({
    document, window, console: { log() {}, error() {} },
    Math: Object.create(Math),
    setTimeout(fn, delay = 0) { const id = ++timerId; timers.set(id, { fn, at: clock + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch: () => new Promise(() => {}),
    d3: { select: () => selection, selectAll: () => selection, geoNaturalEarth1: () => selection, geoPath: () => selection },
    feature: () => ({ features: [] })
  });
  context.Math.random = () => 0;
  let source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  if (geo) source = source.replace(/import\s+[\s\S]*?from\s+"[^"]+";/g, '');
  vm.runInContext(source, context, { filename: relativePath });
  return {
    document, window, mapEvents, run: code => vm.runInContext(code, context),
    advance(ms) {
      const until = clock + ms; let guard = 0;
      while (true) {
        const next = [...timers].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        assert.ok(++guard < 1000, 'timer loop');
        timers.delete(next[0]); clock = next[1].at; next[1].fn();
      }
      clock = until;
    }
  };
}

const termoo = () => loadGame('pages/Jogos/Termoo/JSdoTermo.js', ['game-board', 'keyboard', 'game-message', 'reset-btn', 'play-again-btn']);
const matching = () => loadGame('pages/Jogos/WordMatching/JSdoJOGOWordMatching.js', ['frasePortugues', 'palavrasContainer', 'resultadoContainer', 'feedback', 'btnVerificar', 'btnReset', 'btnNova']);
const geoGuess = () => {
  const game = loadGame('pages/Jogos/WordGuess/JSdoWordGuess.js', ['mapContainer', 'guessInput', 'markBtn', 'resetBtn', 'log', 'score', 'totalCount', 'found-list', 'showListBtn', 'namesContainer', 'namesList', 'guessStatus'], true);
  game.run(`countries = [{ id: '076', properties: { name: 'Brazil' } }, { id: '250', properties: { name: 'France' } }, { id: '384', properties: { name: "Côte d'Ivoire" } }];
    countries.forEach(f => { enToFeature.set(f.properties.name, f); nameIndex.set(normalize(f.properties.name), [f]); });`);
  return game;
};

test('Termoo selects only five playable letters, including normalized accents', () => {
  const game = termoo();
  const list = game.run('WORD_LIST');
  assert.equal(list.some(word => !/^[A-Z]{5}$/.test(word)), false);
  assert.equal(game.run('isValidWord("irmão")'), true);
  assert.equal(game.run('isValidWord("MODO")'), false);
});

test('Termoo reset cancels the old row reveal without advancing the new game', () => {
  const game = termoo();
  game.run('targetWord = "ABRIR"; currentGuess = "AMIGO"; updateBoard(); submitGuess(); init();');
  game.advance(2000);
  assert.equal(game.run('currentRow'), 0);
  assert.equal(game.run('guesses.length'), 0);
});

test('Termoo celebrates a first-row win and preserves its result message', () => {
  const game = termoo();
  game.run('targetWord = "ABRIR"; currentGuess = "ABRIR"; updateBoard(); submitGuess();');
  game.advance(5000);
  assert.equal(game.document.getElementById('tile-0-0').classList.contains('win'), true);
  assert.equal(game.document.getElementById('game-message').classList.contains('hidden'), false);
  assert.equal(game.run('gameOver'), true);
});

test('Termoo leaves hub text entry alone and prevents game Enter default', () => {
  const game = termoo(); const input = new Element('input');
  game.document.dispatch('keydown', { key: 'a', target: input });
  assert.equal(game.run('currentGuess'), '');
  const event = game.document.dispatch('keydown', { key: 'Enter' });
  assert.equal(event.defaultPrevented, true);
});

test('Termoo physical typing works immediately after the focused reset button restarts the game', () => {
  const game = termoo();
  const reset = game.document.getElementById('reset-btn');
  reset.tagName = 'BUTTON'; reset.focus(); reset.click();
  game.document.dispatch('keydown', { key: 'a', target: game.document.activeElement });
  assert.equal(game.run('currentGuess'), 'A');
  const search = new Element('input'); game.document.appendChild(search); search.focus();
  game.document.dispatch('keydown', { key: 'b', target: game.document.activeElement });
  assert.equal(game.run('currentGuess'), 'A');
});

test('Termoo allocates repeated letters without exceeding the target count', () => {
  const game = termoo(); game.run('targetWord = "AMIGO";');
  assert.deepEqual(Array.from(game.run('"MAMAS".split("").map((l, i) => getTileStatus(l, i, "MAMAS"))')), ['present', 'present', 'absent', 'absent', 'absent']);
});

test('Termoo incomplete and unknown guesses do not consume a row', () => {
  const game = termoo();
  game.run('currentGuess = "ABC"; submitGuess(); currentGuess = "ZZZZZ"; submitGuess();');
  game.advance(2000);
  assert.equal(game.run('currentRow'), 0);
  assert.equal(game.run('guesses.length'), 0);
});

test('Word Matching consumes one token per click and restores only that occurrence', () => {
  const game = matching();
  game.run('fraseAtual = { pt: "", en: "I think that that is good." };');
  const bank = game.document.getElementById('palavrasContainer'); bank.innerHTML = '';
  ['I', 'think', 'that', 'that', 'is', 'good.'].forEach(word => bank.appendChild(game.run(`criarPalavra(${JSON.stringify(word)})`)));
  const first = bank.children[2]; first.click();
  assert.equal(bank.children.length, 5);
  const second = bank.children.find(el => el.textContent === 'that'); second.click();
  const result = game.document.getElementById('resultadoContainer'); result.children[0].click();
  assert.equal(result.querySelectorAll('.palavraSelecionada').length, 1);
  assert.deepEqual(Array.from(game.run('palavrasSelecionadas')), ['that']);
  assert.equal(bank.children.length, 5);
});

test('Word Matching bank drag does not insert a missing selected element', () => {
  const game = matching(); const result = game.document.getElementById('resultadoContainer');
  game.document.getElementById('palavrasContainer').children[0].click();
  const selected = result.querySelector('.palavraSelecionada');
  assert.doesNotThrow(() => result.dispatch('dragover', { target: selected, clientX: 25 }));
});

test('Word Matching arrow keys reorder individual selected tokens', () => {
  const game = matching(); const bank = game.document.getElementById('palavrasContainer');
  bank.innerHTML = ''; ['one', 'two'].forEach(word => bank.appendChild(game.run(`criarPalavra(${JSON.stringify(word)})`)));
  bank.children[0].click(); bank.children[0].click();
  const selected = game.document.getElementById('resultadoContainer').querySelectorAll('.palavraSelecionada');
  selected[1].dispatch('keydown', { key: 'ArrowLeft' });
  assert.deepEqual(Array.from(game.run('palavrasSelecionadas')), ['two', 'one']);
});

test('Word Matching dragging a repeated word moves only that physical token', () => {
  const game = matching(); const bank = game.document.getElementById('palavrasContainer');
  const result = game.document.getElementById('resultadoContainer');
  bank.innerHTML = ''; ['that', 'that'].forEach(word => bank.appendChild(game.run('criarPalavra("that")')));
  const token = bank.children[0];
  token.dispatch('dragstart', { dataTransfer: { setData() {} } }); result.dispatch('drop');
  assert.equal(bank.children.length, 1);
  assert.equal(result.querySelectorAll('.palavraSelecionada').length, 1);
  bank.children[0].click();
  token.dispatch('dragstart', { dataTransfer: { setData() {} } }); bank.dispatch('drop');
  assert.deepEqual(Array.from(game.run('palavrasSelecionadas')), ['that']);
  assert.equal(bank.children.length, 1);
});

test('Word Matching reset restores all tokens and cancels scheduled progression', () => {
  const game = matching();
  game.run('fraseAtual = { pt: "fixture", en: "I" }; document.getElementById("frasePortugues").textContent = "fixture";');
  const bank = game.document.getElementById('palavrasContainer'); bank.innerHTML = ''; bank.appendChild(game.run('criarPalavra("I")'));
  bank.children[0].click(); game.document.getElementById('btnVerificar').click();
  game.document.getElementById('btnReset').click(); game.advance(1000);
  assert.equal(game.document.getElementById('frasePortugues').textContent, 'fixture');
  assert.equal(bank.children.length, 1);
  assert.equal(game.run('palavrasSelecionadas.length'), 0);
  assert.equal(game.document.getElementById('feedback').textContent, '');
});

test('GeoGuess accepts complete aliases but rejects arbitrary fragments', () => {
  const game = geoGuess();
  assert.equal(game.run('findMatches("brásil").length'), 1);
  assert.equal(game.run('findMatches("b").length'), 0);
  assert.equal(game.run('findMatches("brazil garbage").length'), 0);
  assert.equal(game.run('findMatches("  costa   do marfim  ").length'), 1);
});

test('GeoGuess distinguishes an already found country from an unknown country', () => {
  const game = geoGuess(); game.run('applyMatches(findMatches("brasil"), "brasil"); applyMatches(findMatches("brasil"), "brasil");');
  assert.equal(game.run('foundSet.size'), 1);
  assert.match(game.document.getElementById('log').firstChild.textContent, /já|repetido/i);
});

test('GeoGuess reset button clears progress and current input', () => {
  const game = geoGuess(); game.run('applyMatches(findMatches("brasil"), "brasil"); guessInput.value = "france";');
  game.document.getElementById('resetBtn').click();
  assert.equal(game.run('foundSet.size'), 0);
  assert.equal(game.document.getElementById('log').children.length, 0);
  assert.equal(game.document.getElementById('guessInput').value, '');
});

test('GeoGuess empty submission provides feedback without adding a log entry', () => {
  const game = geoGuess(); game.run('markBtn.disabled = false; guessInput.value = "   ";');
  game.document.getElementById('markBtn').click();
  assert.match(game.document.getElementById('guessStatus').textContent, /digite/i);
  assert.equal(game.document.getElementById('log').children.length, 0);
});

test('GeoGuess repeated map renders do not accumulate resize handlers', () => {
  const game = geoGuess(); game.run('drawMap(); drawMap(); drawMap();');
  assert.equal(game.window.listeners.resize.length, 1);
});

test('GeoGuess clicking a country without an alias fills its English name', () => {
  const game = geoGuess(); game.run('drawMap();');
  game.mapEvents.click({}, { properties: { name: 'Unknown island' } });
  assert.equal(game.document.getElementById('guessInput').value, 'Unknown island');
});
