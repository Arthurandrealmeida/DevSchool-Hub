let startTime = Date.now();
const grid = document.querySelector('.grid')

const LinguagensBase = [
  'CSharp','Python','html','CSS2','JS2','assembly','PHP',
  'NODEJS2','REACT2','java','ruby','Cplusplus','C',
  'cobol2','go2','Rust','lua'
];

const dificuldadeSelect = document.getElementById('dificuldade');
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
        Linguagens = LinguagensBase.slice(0, 18);  // 18 pares = 36 cartas
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

btnReiniciar.onclick = () => location.reload();
btnFechar.onclick = () => modal.classList.remove('show');

const ckeckEndGame = ()=>{

    const cardDisabilidado = document.querySelectorAll('.disabled-card');

    if (cardDisabilidado.length === Linguagens.length * 2) {
        
        const endTime = Date.now();
        const seconds = Math.floor((endTime - startTime) / 1000);

        tempoFinalTexto.textContent = `Você terminou em ${seconds} segundos!`;

        modal.classList.add('show'); // mostra a janela
    }
}




const check = () => {

    const primeiraLinguagem = primeiraCarta.getAttribute('data-linguagem');
    const segundaLinguagem = segundaCarta.getAttribute('data-linguagem');

    if (primeiraLinguagem === segundaLinguagem) {

         primeiraCarta.classList.add('disabled-card');
        segundaCarta.classList.add('disabled-card');

        primeiraCarta.firstChild.classList.add('cardDisabilidado');
        segundaCarta.firstChild.classList.add('cardDisabilidado');

        // impede qualquer clique
        primeiraCarta.style.pointerEvents = 'none';
        segundaCarta.style.pointerEvents = 'none';

        primeiraCarta = '';
        segundaCarta = '';

        ckeckEndGame();

    } else {
        setTimeout(() => {
            primeiraCarta.classList.remove('revelarCard');
            segundaCarta.classList.remove('revelarCard');

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
        primeiraCarta = card;
    } else if (segundaCarta === '') {
        card.classList.add('revelarCard');
        segundaCarta = card;

        check();
    }
};


const createCard = (Linguagem)=> {
    const card = createElement('div', 'card'); //Nossa função está criando o elemento div e vai pegar a classe e vai colocar dentro do elemento
    const front = createElement('div', 'face front');
    const back =  createElement('div', 'face back');

   front.style.backgroundImage = `url('../../../imagens/imagensDoJogoDaMemoria/${Linguagem}.png')`;


    card.appendChild(front);
    card.appendChild(back)

    card.addEventListener('click', revelarCard)
    card.setAttribute('data-linguagem',Linguagem) // ter um novo atributo para conseguir verificar se são iguais

return card;
}

function loadGame() {

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

    embaralhado.forEach((ling) => {
        const card = createCard(ling);
        grid.appendChild(card);
    });

    startTime = Date.now();
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
