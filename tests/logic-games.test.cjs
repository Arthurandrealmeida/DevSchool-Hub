const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Execute the existing browser scripts with a small DOM and controlled clock.
// This keeps timer races reproducible without adding browser dependencies.
function loadGame(directory, htmlFile, scriptFile) {
    const elements = [];
    const listeners = {};
    let now = 0;
    let nextTimer = 1;
    const timers = new Map();
    let document;
    class Element {
        constructor(tag, attributes = '') {
            this.tagName = tag.toUpperCase();
            this.attributes = Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
            this.id = this.attributes.id;
            this.dataset = Object.fromEntries(Object.entries(this.attributes).filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5), v]));
            const classes = new Set((this.attributes.class || '').split(/\s+/).filter(Boolean));
            this.classList = {
                add: (...names) => names.forEach(name => classes.add(name)),
                remove: (...names) => names.forEach(name => classes.delete(name)),
                contains: name => classes.has(name),
                toggle: (name, force) => {
                    const add = force === undefined ? !classes.has(name) : force;
                    if (add) classes.add(name); else classes.delete(name);
                    return add;
                }
            };
            this.style = {};
            this.textContent = '';
            this.value = this.attributes.value || '';
            this.disabled = /\bdisabled(?:\s|>|$)/.test(attributes);
            this.listeners = {};
            this.removed = false;
        }
        get innerText() { return this.textContent; }
        set innerText(value) { this.textContent = value; }
        addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
        setAttribute(name, value) { this.attributes[name] = String(value); }
        getAttribute(name) { return this.attributes[name] ?? null; }
        focus() { document.activeElement = this; }
        remove() {
            this.removed = true;
            if (this.classList.contains('quiz')) elements.filter(el => el.classList.contains('quiz-option')).forEach(el => el.removed = true);
        }
        insertAdjacentHTML(_position, html) { parse(html); }
        dispatch(type, extra = {}) {
            if (type === 'click' && this.disabled) return;
            const event = { target: this, currentTarget: this, preventDefault() {}, ...extra };
            this[`on${type}`]?.(event);
            (this.listeners[type] || []).forEach(listener => listener(event));
        }
    }
    function parse(html) {
        for (const match of html.matchAll(/<(button|input|select|div|span|strong|p|h[1-6])\b([^>]*)>/g)) {
            const element = new Element(match[1], match[2]);
            if (element.id || element.attributes.class) elements.push(element);
        }
    }
    document = {
        activeElement: null,
        getElementById: id => elements.find(el => !el.removed && el.id === id) || null,
        querySelectorAll: selector => elements.filter(el => !el.removed && (selector.startsWith('.') ? el.classList.contains(selector.slice(1)) : el.id === selector.slice(1))),
        querySelector: selector => document.querySelectorAll(selector)[0] || null,
        addEventListener: (type, callback) => (listeners[type] ||= []).push(callback)
    };
    const schedule = (callback, delay, repeat) => {
        const id = nextTimer++;
        timers.set(id, { callback, at: now + delay, repeat });
        return id;
    };
    const folder = path.join(__dirname, '..', 'pages', 'Jogos', directory);
    parse(fs.readFileSync(path.join(folder, htmlFile), 'utf8'));
    const math = Object.create(Math);
    math.random = () => 0.5;
    const context = vm.createContext({
        document, Math: math, console, alert() {},
        window: { addEventListener: (type, callback) => (listeners[type] ||= []).push(callback) },
        setTimeout: (callback, delay) => schedule(callback, delay, 0),
        clearTimeout: id => timers.delete(id),
        setInterval: (callback, delay) => schedule(callback, delay, delay),
        clearInterval: id => timers.delete(id)
    });
    vm.runInContext(fs.readFileSync(path.join(folder, scriptFile), 'utf8'), context);
    // The select's initial value normally comes from its first HTML option.
    if (document.getElementById('n-back')) document.getElementById('n-back').value = '2';
    return {
        get: id => document.getElementById(id),
        all: selector => document.querySelectorAll(selector),
        run: code => vm.runInContext(code, context),
        dispatch: (type, event = {}) => (listeners[type] || []).forEach(listener => listener({ preventDefault() {}, ...event })),
        async advance(milliseconds) {
            const until = now + milliseconds;
            for (;;) {
                const next = [...timers.entries()].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
                if (!next) break;
                const [id, timer] = next;
                now = timer.at;
                if (timer.repeat) timer.at += timer.repeat; else timers.delete(id);
                timer.callback();
                await Promise.resolve();
                await Promise.resolve();
            }
            now = until;
        }
    };
}

const debugGame = () => loadGame('DebugChallenge', 'debug.html', 'JSdoDebugChallenge.js');
const dualGame = () => loadGame('DualNback', 'jogoDuanNback.html', 'JSdoJOGODualBack.js');
const mathGame = () => loadGame('JogoMatematico', 'jogoMatematico.html', 'JSdoJOGOdaMath.js');
function prepareMath(game, op = '+') {
    game.all('.diff-btn').find(button => button.dataset.diff === 'easy').dispatch('click');
    game.all('.op-btn').find(button => button.dataset.op === op).dispatch('click');
}
function enter(game, value) {
    game.get('answer').value = value;
    game.get('answer').dispatch('keyup', { key: 'Enter' });
}

test('Debug: answering near expiry advances exactly one challenge', async () => {
    const game = debugGame();
    game.get('btn-start').dispatch('click');
    await game.advance(59500);
    game.all('.quiz-option')[0].dispatch('click');
    await game.advance(700);
    assert.equal(Number(game.get('stat-level').textContent), 2);
});

test('Debug: returning to the menu cancels a correct-answer transition', async () => {
    const game = debugGame();
    game.get('btn-start').dispatch('click');
    game.all('.quiz-option')[0].dispatch('click');
    game.get('btn-reset').dispatch('click');
    game.get('btn-start').dispatch('click');
    await game.advance(700);
    assert.equal(Number(game.get('stat-level').textContent), 1);
    assert.equal(Number(game.get('stat-score').textContent), 0);
});

test('Debug: an expired challenge ends the streak and cannot award points', async () => {
    const game = debugGame();
    game.get('btn-start').dispatch('click');
    game.all('.quiz-option')[0].dispatch('click');
    await game.advance(600);
    await game.advance(60000);
    assert.equal(Number(game.get('stat-streak').textContent), 0);
    const before = Number(game.get('stat-score').textContent);
    game.all('.quiz-option')[0].dispatch('click');
    assert.equal(Number(game.get('stat-score').textContent), before);
});

test('Debug: returning through browser history shows a playable menu instead of a frozen challenge', async () => {
    const game = debugGame();
    game.get('btn-start').dispatch('click');
    game.all('.quiz-option')[0].dispatch('click');
    game.dispatch('pagehide');
    await game.advance(1000);
    assert.equal(game.get('screen-idle').classList.contains('hidden'), false);
    assert.equal(game.get('screen-playing').classList.contains('hidden'), true);
    game.get('btn-start').dispatch('click');
    await game.advance(1000);
    assert.equal(Number(game.get('stat-level').textContent), 1);
    assert.equal(Number(game.get('stat-time').textContent), 59);
});

test('Dual N-Back: repeated Start cannot create overlapping sequences', async () => {
    const game = dualGame();
    game.get('start-btn').dispatch('click');
    game.get('start-btn').dispatch('click');
    await game.advance(1600);
    assert.equal(game.run('sequence.length'), 2);
});

test('Dual N-Back: color and emoji can both score once on the same step', async () => {
    const game = dualGame();
    game.get('start-btn').dispatch('click');
    await game.advance(3200);
    game.get('match-color').dispatch('click');
    game.get('match-color').dispatch('click');
    game.get('match-emoji').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 2);
});

test('Dual N-Back: the 50-step session finishes and locks further answers', async () => {
    const game = dualGame();
    game.get('start-btn').dispatch('click');
    await game.advance(80000);
    assert.equal(game.run('running'), false);
    game.get('match-color').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 0);
});

test('Dual N-Back: stopping then restarting leaves one fresh session', async () => {
    const game = dualGame();
    game.get('start-btn').dispatch('click');
    await game.advance(400);
    assert.ok(game.get('stop-btn'), 'A running session needs a stop control');
    game.get('stop-btn').dispatch('click');
    game.get('start-btn').dispatch('click');
    await game.advance(1200);
    assert.equal(game.run('sequence.length'), 1);
    await game.advance(400);
    assert.equal(game.run('sequence.length'), 2);
});

test('Dual N-Back: C and E answer independently while typing in search is ignored', async () => {
    const game = dualGame();
    game.get('start-btn').dispatch('click');
    await game.advance(3200);
    game.dispatch('keydown', { key: 'c', target: { tagName: 'INPUT' } });
    assert.equal(Number(game.get('score').textContent), 0);
    game.dispatch('keydown', { key: 'c', target: game.get('match-color') });
    game.dispatch('keydown', { key: 'e', target: game.get('match-emoji') });
    assert.equal(Number(game.get('score').textContent), 2);
});

test('Dual N-Back: false matches lose one point each without going below zero', async () => {
    const game = dualGame();
    game.get('start-btn').dispatch('click');
    await game.advance(3200);
    game.get('match-color').dispatch('click');
    game.get('match-emoji').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 2);
    // Subsequent steps use the first color/emoji, unlike both N-back steps.
    game.run('Math.random = () => 0');
    await game.advance(1600);
    game.get('match-color').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 1);
    game.get('match-color').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 1);
    game.get('match-emoji').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 0);
    await game.advance(1600);
    game.get('match-color').dispatch('click');
    game.get('match-emoji').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 0);
});

test('Math: Enter before setup never awards a point', () => {
    const game = mathGame();
    enter(game, '');
    assert.equal(Number(game.get('score').textContent), 0);
});

test('Math: blank input is not accepted as the answer zero', () => {
    const game = mathGame();
    prepareMath(game, '-');
    enter(game, '');
    assert.equal(Number(game.get('score').textContent), 0);
    assert.equal(game.get('question').textContent, '6 - 6');
});

test('Math: repeated Enter awards only one point per question', () => {
    const game = mathGame();
    prepareMath(game);
    enter(game, '12');
    enter(game, '12');
    assert.equal(Number(game.get('score').textContent), 1);
});

test('Math: a timed-out question cannot be answered during feedback', async () => {
    const game = mathGame();
    prepareMath(game);
    await game.advance(12000);
    enter(game, '12');
    assert.equal(Number(game.get('score').textContent), 0);
});

test('Math: changing operations cancels the old pending question', async () => {
    const game = mathGame();
    prepareMath(game);
    enter(game, '12');
    await game.advance(400);
    game.all('.op-btn').find(button => button.dataset.op === '*').dispatch('click');
    await game.advance(1000);
    assert.equal(Number(game.get('timer').textContent), 11);
    assert.equal(game.get('question').textContent, '6 * 6');
});

test('Math: stopping cancels the feedback transition and locks answers', async () => {
    const game = mathGame();
    prepareMath(game);
    enter(game, '12');
    assert.ok(game.get('stop-training'), 'An active drill needs a stop control');
    game.get('stop-training').dispatch('click');
    const stoppedQuestion = game.get('question').textContent;
    await game.advance(12000);
    enter(game, '12');
    assert.equal(game.get('question').textContent, stoppedQuestion);
    assert.equal(Number(game.get('score').textContent), 1);
});

test('Math: the confirm button allows a single submission without Enter', () => {
    const game = mathGame();
    prepareMath(game);
    assert.ok(game.get('confirm-answer'), 'A touch user needs a visible submit control');
    game.get('answer').value = '12';
    game.get('confirm-answer').dispatch('click');
    game.get('confirm-answer').dispatch('click');
    assert.equal(Number(game.get('score').textContent), 1);
});
