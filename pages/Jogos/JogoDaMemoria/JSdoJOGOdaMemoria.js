let startTime = performance.now();
let mismatchTimeout;
const grid = document.querySelector('.grid')

const LinguagensBase = [
  'CSharp','Python','HTML','CSS2','JS2','assembly','PHP',
  'NODEJS2','REACT2','java','ruby','Cplusplus','C',
  'cobol2','go2','Rust','lua'
];

const dificuldadeSelect = document.getElementById('dificuldade');
const nomesLinguagens = {
    CSharp: 'C#', Python: 'Python', HTML: 'HTML', CSS2: 'CSS', JS2: 'JavaScript',
    assembly: 'Assembly', PHP: 'PHP', NODEJS2: 'Node.js', REACT2: 'React',
    java: 'Java', ruby: 'Ruby', Cplusplus: 'C++', C: 'C', cobol2: 'COBOL',
    go2: 'Go', Rust: 'Rust', lua: 'Lua'
};
let Linguagens = []; // será preenchido conforme dificuldade

function definirDificuldade() {
    const modo = dificuldadeSelect.value;

    if (modo === "facil") {
        Linguagens = LinguagensBase.slice(0, 5);   // 5 pares = 10 cartas
    } 
    else if (modo === "medio") {
        Linguagens = LinguagensBase.slice(0, 10);  // 10 pares = 20 cartas
    } 
    else {
        Linguagens = [...LinguagensBase];  // Todas as 17 linguagens disponíveis
    }
}


const createElement = (tag, classname)=> {
    const element = document.createElement(tag);
    element.className = classname
    return element;
}

    let primeiraCarta = '';
    let segundaCarta = '';

    const modal = document.getElementById('modalFimDeJogo');
const tempoFinalTexto = document.getElementById('tempoFinal');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnFechar = document.getElementById('btnFechar');
const btnNovaPartida = document.getElementById('btnNovaPartida');
const layout = document.querySelector('.layout');

btnReiniciar.onclick = () => {
    loadGame();
    btnNovaPartida.focus();
};
btnNovaPartida.onclick = () => loadGame();
const fecharModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    layout.inert = false;
    btnNovaPartida.focus();
};
btnFechar.onclick = fecharModal;
document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('show')) return;
    if (event.key === 'Escape') fecharModal();
    if (event.key === 'Tab') {
        event.preventDefault();
        if (document.activeElement === btnReiniciar) btnFechar.focus();
        else btnReiniciar.focus();
    }
});

const ckeckEndGame = ()=>{

    const cardDisabilidado = document.querySelectorAll('.disabled-card');

    if (cardDisabilidado.length === Linguagens.length * 2) {
        
        const endTime = performance.now();
        const seconds = Math.floor((endTime - startTime) / 1000);

        tempoFinalTexto.textContent = `Você terminou em ${seconds} segundos!`;

        modal.classList.add('show'); // mostra a janela
        modal.setAttribute('aria-hidden', 'false');
        layout.inert = true;
        btnReiniciar.focus();
    }
}




const check = () => {

    const primeiraLinguagem = primeiraCarta.getAttribute('data-linguagem');
    const segundaLinguagem = segundaCarta.getAttribute('data-linguagem');

    if (primeiraLinguagem === segundaLinguagem) {

         primeiraCarta.classList.add('disabled-card');
        segundaCarta.classList.add('disabled-card');
        primeiraCarta.disabled = true;
        segundaCarta.disabled = true;
        primeiraCarta.setAttribute('aria-label', `${nomesLinguagens[primeiraLinguagem]}, par encontrado`);
        segundaCarta.setAttribute('aria-label', `${nomesLinguagens[segundaLinguagem]}, par encontrado`);

        primeiraCarta.firstChild.classList.add('cardDisabilidado');
        segundaCarta.firstChild.classList.add('cardDisabilidado');

        // impede qualquer clique
        primeiraCarta.style.pointerEvents = 'none';
        segundaCarta.style.pointerEvents = 'none';

        primeiraCarta = '';
        segundaCarta = '';

        ckeckEndGame();

    } else {
        mismatchTimeout = setTimeout(() => {
            primeiraCarta.classList.remove('revelarCard');
            segundaCarta.classList.remove('revelarCard');
            primeiraCarta.setAttribute('aria-label', primeiraCarta.dataset.hiddenLabel);
            segundaCarta.setAttribute('aria-label', segundaCarta.dataset.hiddenLabel);

            primeiraCarta = '';
            segundaCarta = '';
        }, 600);
    }
};



const revelarCard = (event) => {
    const card = event.currentTarget; // sempre o card certo

    if (card.classList.contains('revelarCard')) {
        return;
    }

    if (primeiraCarta === '') {
        card.classList.add('revelarCard');
        card.setAttribute('aria-label', `${nomesLinguagens[card.getAttribute('data-linguagem')]}, revelada`);
        primeiraCarta = card;
    } else if (segundaCarta === '') {
        card.classList.add('revelarCard');
        card.setAttribute('aria-label', `${nomesLinguagens[card.getAttribute('data-linguagem')]}, revelada`);
        segundaCarta = card;

        check();
    }
};


const createCard = (Linguagem, index)=> {
    const card = createElement('button', 'card');
    card.type = 'button';
    card.dataset.hiddenLabel = `Carta ${index + 1}, virada para baixo`;
    card.setAttribute('aria-label', card.dataset.hiddenLabel);
    const front = createElement('span', 'face front');
    const back = createElement('span', 'face back');
    front.setAttribute('aria-hidden', 'true');
    back.setAttribute('aria-hidden', 'true');

   front.style.backgroundImage = `url('../../../imagens/imagensDoJogoDaMemoria/${Linguagem}.png')`;


    card.appendChild(front);
    card.appendChild(back)

    card.addEventListener('click', revelarCard)
    card.setAttribute('data-linguagem',Linguagem) // ter um novo atributo para conseguir verificar se são iguais

return card;
}

function loadGame() {
    clearTimeout(mismatchTimeout);
    primeiraCarta = '';
    segundaCarta = '';
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    layout.inert = false;

    // Limpa todos os modos antes de aplicar o novo
    document.body.classList.remove("modo-facil", "modo-medio", "modo-dificil");

    // Ativa o modo correto
    if (dificuldadeSelect.value === "facil") {
        document.body.classList.add("modo-facil");
    }
    else if (dificuldadeSelect.value === "medio") {
        document.body.classList.add("modo-medio");
    }
    else {
        document.body.classList.add("modo-dificil");
    }

    document.querySelector('.placeholder').style.display = "none";

    grid.innerHTML = "";
    definirDificuldade();

    const duplicate = [...Linguagens, ...Linguagens];
    const embaralhado = duplicate.sort(() => Math.random() - 0.5);

    embaralhado.forEach((ling, index) => {
        const card = createCard(ling, index);
        grid.appendChild(card);
    });

    startTime = performance.now();
}


dificuldadeSelect.addEventListener("change", () => {
    primeiraCarta = "";
    segundaCarta = "";
    loadGame();
});

// inicia o jogo automaticamente com a dificuldade já selecionada
window.addEventListener("load", () => {
    loadGame();
});
