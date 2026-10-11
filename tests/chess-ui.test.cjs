const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// The controller must hold its lock until a slow engine has actually finished.
function setup() {
  const nodes = new Map();
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {
      value: id === 'bot-color' ? 'black' : '1', checked: true,
      style: {}, disabled: false, textContent: '', listeners: {},
      addEventListener(event, fn) { this.listeners[event] = fn; },
      setAttribute() {}, focus() {}, querySelectorAll() { return []; }, querySelector() { return null; },
    });
    return nodes.get(id);
  }
  const ready = [];
  const intervals = [];
  const timeouts = [];
  let calls = 0;
  let finish;
  const result = new Promise(resolve => { finish = resolve; });
  const context = vm.createContext({
    document: { getElementById: node, querySelector: () => node('layout'),
      querySelectorAll: () => [], activeElement: null,
      addEventListener(event, fn) { if (event === 'DOMContentLoaded') ready.push(fn); } },
    window: { playBot: async () => { calls++; return result; } },
    turnoAtual: 'black', console, Promise,
    setInterval(fn) { intervals.push(fn); return intervals.length; },
    setTimeout(fn) { timeouts.push(fn); return timeouts.length; },
    clearTimeout() {}, clearInterval() {}, MutationObserver: class { observe() {} },
  });
  const dir = path.join(__dirname, '../pages/Jogos/xadrez');
  const controller = path.join(dir, 'JS/chess-ui.js');
  const source = fs.existsSync(controller) ? fs.readFileSync(controller, 'utf8') :
    [...fs.readFileSync(path.join(dir, 'xadrez.html'), 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n');
  vm.runInContext(source, context);
  ready.forEach(fn => fn());
  node('mode-computer').listeners.click();
  async function tick() {
    intervals.forEach(fn => { void fn(); });
    timeouts.splice(0).forEach(fn => { void fn(); });
    await Promise.resolve();
  }
  return { node, tick, context, calls: () => calls, finish };
}

test('automatic chess opponent does not overlap slow moves', async () => {
  const game = setup();
  await game.tick();
  await game.tick();
  assert.equal(game.calls(), 1);
  game.finish(true);
  await Promise.resolve();
});

test('bot settings stay locked until an asynchronous move finishes', async () => {
  const game = setup();
  await game.tick();
  assert.equal(game.node('bot-color').disabled, true);
  assert.equal(game.node('bot-level').disabled, true);
  game.finish(true);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(game.node('bot-color').disabled, false);
  assert.equal(game.node('bot-level').disabled, false);
});

test('finished chess games do not request another bot move', async () => {
  const game = setup();
  game.context.window.gameOver = true;
  await game.tick();
  assert.equal(game.calls(), 0);
});

for (const level of [1, 2]) {
  test(`chess bot level ${level} keeps a pinned rook in front of its king`, async () => {
    const positions = { e1: 'reiBranco', e2: 'torreBranco', e8: 'torrePreto', a8: 'reiPreto' };
    const squares = Object.entries(positions).map(([coord, image]) => ({
      dataset: { coord }, querySelector: () => ({ src: `img/${image}.png` }),
    }));
    let played;
    let sample = 0;
    const math = Object.create(Math);
    math.random = () => sample / 100;
    const context = vm.createContext({
      window: {}, document: {
        querySelectorAll: () => squares,
        querySelector: selector => ({ dataset: { coord: selector.match(/"([a-h][1-8])"/)[1] }, querySelector: () => ({}) }),
      },
      Blob, Worker: class { postMessage() {} }, URL: { createObjectURL: () => 'test-worker' },
      Math: math, console,
      posiçãoNumerica: coord => ({ x: coord.charCodeAt(0) - 97, y: 8 - Number(coord[1]) }),
      posicaoID: pos => String.fromCharCode(97 + pos.x) + (8 - pos.y),
      moverPeca: (from, to) => { played = { from: from.dataset.coord, to: to.dataset.coord }; },
    });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../pages/Jogos/xadrez/JS/bots.js'), 'utf8'), context);
    for (sample = 0; sample < 100; sample++) {
      await context.window.playBot(level, 'white');
      assert.ok(played, 'the position has legal moves');
      assert.ok(played.from !== 'e2' || played.to.startsWith('e'), `illegal pinned move: ${played.from}-${played.to}`);
    }
  });
}
