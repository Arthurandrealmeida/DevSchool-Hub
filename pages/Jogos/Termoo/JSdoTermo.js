const WORD_LIST = [
    "ABRIR", "ACESO", "ACRES", "AGORA", "AINDA", "ALMAS", "ALTAR", "ALTOS",
    "AMIGO", "ANDAR", "ANTES", "APOIO", "AREIA", "ATUAR", "AUDIO", "AULAS",
    "BANCO", "BANDA", "BARCO", "BASTA", "BATOM", "BEBER", "BEIJO", "BELOS",
    "BOLSA", "BONUS", "BRAVO", "BREVE", "BUSCA", "CABER", "CABOS", "CALMA",
    "CALOR", "CAMAS", "CAMPO", "CAPAZ", "CARNE", "CAROS", "CARTA", "CASAL",
    "CAUSA", "CENAS", "CERTO", "CHAVE", "CHEGA", "CHEIO", "CHUVA", "CINCO",
    "CLARA", "CLIMA", "COBRA", "COMUM", "CONTA", "CORDA", "CORES", "CORPO",
    "CORTE", "COSTA", "CRIAR", "CRISE", "CUSTA", "DADOS", "DANOS", "DATAS",
    "DEIXA", "DENTE", "DESDE", "DEVER", "DISCO", "DIZER", "DOCES", "DOBRO",
    "DORES", "DORME", "DRAMA", "DUPLA", "DURAS", "EMAIL", "ENTRE", "EPOCA",
    "ERROS", "ETAPA", "EXATO", "EXTRA", "FACIL", "FALAR", "FALTA", "FATOS",
    "FAZER", "FEBRE", "FELIZ", "FESTA", "FIBRA", "FICAR", "FILHA", "FILHO",
    "FILME", "FINAL", "FIQUE", "FLORA", "FONTE", "FORAM", "FORCA", "FORMA",
    "FORTE", "FORNO", "FOTOS", "FRACO", "FRASE", "FROTA", "FRUTA", "FUGIR",
    "FUMAR", "FUNDO", "GANHA", "GASTO", "GATOS", "GERAL", "GESTO", "GLOBO",
    "GRADE", "GRAMA", "GRAVE", "GREVE", "GRUPO", "HAVER", "HEROI", "HOTEL",
    "HUMOR", "IDEAL", "IDADE", "IDEIA", "IGUAL", "ILHAS", "IMPOR", "INDIO",
    "JAPAO", "JATOS", "JOGOS", "JUIZO", "JULHO", "JUNHO", "JUNTO", "JUROS",
    "JUSTA", "JUSTO", "LABOR", "LACOS", "LANCE", "LARGA", "LARGO", "LASER",
    "LEGAL", "LEITE", "LENDA", "LENTO", "LETRA", "LEVAR", "LICAO", "LIDAR",
    "LIDER", "LIGAR", "LIMPA", "LIMPO", "LINDA", "LINDO", "LINHA", "LISTA",
    "LIVRO", "LOCAL", "LOJAS", "LONGA", "LONGO", "LUGAR", "LUTAR", "MACHO",
    "MADRE", "MAGRO", "MAIOR", "MAMAS", "MANDA", "MANGA", "MANHA", "MANTO",
    "MARCA", "MARES", "MARIA", "MASSA", "MEDIA", "MEDIR", "MEIOS", "MELAO",
    "MENOR", "MENTE", "MEROS", "MESES", "METAL", "METER", "MINHA", "MISSA",
    "MISTO", "MITOS", "MODEM", "MODAS", "MORAL", "MORTE", "MOTOR", "MUITO",
    "MUNDO", "MURAL", "MUSEU", "NADAR", "NAVIO", "NEGRO", "NERVO", "NIVEL",
    "NOBRE", "NOITE", "NOIVO", "NOMES", "NORMA", "NORTE", "NOTAS", "NOVOS",
    "NUVEM", "OBVIO", "OBRAS", "OCUPA", "OESTE", "OLHAR", "OLHOS", "ONDAS",
    "ONTEM", "OPERA", "ORDEM", "OUVIR", "PADRE", "PAGAR", "PALCO", "PAPEL",
    "PARAR", "PARTE", "PASSO", "PASTA", "PATOS", "PAUSA", "PEDIR", "PEDRO",
    "PEITO", "PELAS", "PELOS", "PENAS", "PENTE", "PERDA", "PERTO", "PESCA",
    "PESOS", "PESTE", "PIANO", "PILAR", "PISTA", "PLACA", "PLANO", "PLENA",
    "PLENO", "PODER", "POETA", "POLVO", "PONTO", "POREM", "PORTA", "PORTO",
    "POSSE", "POSTO", "POUCA", "POUCO", "PRAZO", "PRETO", "PRIMO", "PROVA",
    "PULSO", "PUXAR", "QUAIS", "QUASE", "QUEDA", "QUERO", "QUILO", "QUOTA",
    "RAIVA", "RAROS", "RAZAO", "REAIS", "RECUO", "REDES", "REINA", "RELVA",
    "RENDA", "RESTO", "RETER", "RIGOR", "RISCO", "RITMO", "RIVAL", "ROBOS",
    "ROCHA", "RODAS", "ROMBO", "ROMPE", "ROSCA", "ROSTO", "ROTAS", "RUIDO",
    "RUMOS", "RUSSO", "SABER", "SACRA", "SAGAZ", "SALAO", "SALTO", "SALVA",
    "SANTA", "SANTO", "SAUDE", "SECOS", "SEGUE", "SELOS", "SENSO", "SEREM",
    "SERIE", "SERRA", "SETAS", "SIGNO", "SINAL", "SITIO", "SOBRE", "SOCOS",
    "SOLAR", "SOLOS", "SOLTO", "SOMOS", "SONHO", "SOPRO", "SORTE", "SUBIR",
    "SUCOS", "SUJOS", "SUMIR", "SUMOS", "SURDO", "SURGE", "TANTA", "TANTO",
    "TARDE", "TECTO", "TELAS", "TEMPO", "TEMOS", "TENDA", "TENHO", "TENSO",
    "TERMO", "TERRA", "TESTE", "TETOS", "TINHA", "TIPOS", "TIRAR", "TOCAR",
    "TODOS", "TOMAR", "TONAL", "TOPAS", "TOQUE", "TOTAL", "TRAMA", "TRATA",
    "TRENS", "TREZE", "TRIBO", "TROCA", "TUBOS", "TURMA", "TURNO", "ULTRA",
    "UNICA", "UNICO", "UNIDO", "URGIR", "URINA", "USADA", "USADO", "VAGAR",
    "VAGOS", "VALER", "VALOR", "VAMOS", "VARIA", "VASTO", "VAZIO", "VEIAS",
    "VELAS", "VELHA", "VELHO", "VENDA", "VENTO", "VERDE", "VERSO", "VEZES",
    "VIAJA", "VICIO", "VIDEO", "VIGOR", "VIOLA", "VIRAR", "VISAO", "VISAR",
    "VISTA", "VISTO", "VITAL", "VIVER", "VIVOS", "VOCAL", "VOLTA", "VOTAR",
    "VOTOS", "VULGO", "ZEBRA", "ZINCO", "ZONAS", "ABALO", "ABATE", "ABONO", 
    "ABUSO", "ACASO", "ACHAR", "ADEUS" ,"ADORA", "BANHO", "TENTO", "ANOTA",
    "AFETO", "AJAIS", "AJUDA", "ALADO", "ALUNO", "APELA", "APENA", "APITO", 
    "APURA", "ARMAZ", "ASSIM", "ATACA", "ATRAS", "AVARE", "AVISO", "AZEDO",
    "BAILE", "BAIXO", "BALAS", "BARBA", "BASEA", "BEIRA", "BERRO", "BEMOL", 
    "BICHO", "BOATO", "BOINA", "BORRA", "BRADO", "BRANCA", "BRANCO", "BRISA", 
    "BROTO", "BULIR", "CAIXA", "CALVO", "CANAL", "CANTO", "CARGA", "CASAR", 
    "CASTA", "CAVAM", "CEDER", "CEGAR", "CESTA", "CHORO", "CIVIL", "CLAVE", 
    "COALA", "COLAR", "COVAR", "CUIDA", "DEDOS", "DELAS", "DELES", "DIVAS", 
    "DITOS", "DOGMA", "DOIDA", "DOIDO", "DUELO", "EDEMA", "ELEVA", "ELITE", 
    "ENCHO", "ENJOO", "ENVIO", "ESCOA", "ESPIA", "ESPOR", "ESTAR", "ESTIO", 
    "ESTRE", "ETICA", "FADAS", "FALSO", "FARDO", "FAROL", "FARTO", "FAUNA",
    "FEDOR", "FEIOS", "FERRO", "FIDAS", "FLAIR", "FLUIDO", "FOLIA", "FOSCA", 
    "FOSCO", "FRACO", "FREAR", "FREIO", "FROTA", "FUMOS", "FURIA", "FUROS", 
    "FURTO", "GERAR", "GOSTO", "GRITO", "GUIAI", "HUMOR", "IDEIA", "ILUDA", 
    "IRADO", "IRMÃO", "IRMAO", "JEJUM", "JOGAR", "LAMER", "LIMAR", "LIVRE", 
    "LOTAR", "LOUCO", "MAGIA", "MALAS", "MALHA", "MALTE", "MANIA",
    "MAPAS", "MARIO", "MEDIO", "MELAO", "MODO", "MOLHA", "MOLHO", "MORAR", 
    "MOSCA", "MOTIM", "MOVEL", "MUDAR", "NAVAL", "NOVEL", "NULAS", "NULOS", 
    "OASIS", "OCIAR", "OPCAO", "OTIMO", "PAGAS", "PAINE", "PASMA", "PAZES", 
    "PECAS", "PENSA", "PERUA", "PINTA", "POUPA", "PRESSA", "PRIMA", "PRIME", 
    "PREMI", "PULGA", "PURAS", "PUROS", "QUEDA", "QUERER", "RAIOS", 
    "RAMPA", "RANHO", "RANGO", "REAIS", "REGIO", "RENDA", "REPOR", "RESPE", 
    "RICOS", "ROLAR", "ROMPA", "RUINS", "RURAL", "SAIDA", "SALAO", "SALTO", 
    "SEARA", "SENDA", "SENDO", "SIGLA", "SIGMA", "SILVO", "SIMIO", "SONDA", 
    "TALVEZ", "TANGO", "TECER", "TENAZ", "TEXTO", "TOADA", "TOCAR", "TOURO", 
    "TRAVE", "TRETA", "TRIPA", "URANO", "URINA", "VALIDA", "VELOZ", "VERME", 
    "VERSO", "VERTE", "VERVE", "VIDAS", "VOARE", "VOCES", "VOZER", "ADIDO", 
    "ADUBO", "AFAGA", "AFIAR", "AFLUI", "AFOBA", "VASOS", "VEADO", "VELAR", 
    "ALADO", "ALBUM", "ALEGA", "ALIAR", "AMADA", "AMADO", "AMPLA", "AMPLO", 
    "ANIMA", "ANUIR", "ARACA", "ARADO", "AREAL", "AREAR", "ASILO", "ASSAR", 
    "ATOAR", "AUTOR", "BAETA", "BAZAR", "BERCO", "BINGO", "BIOMA", "VENIA",
    "BLUSA", "BOBOA", "BOMBA", "BOSON", "BOTAR", "BRADO", "BUFAR", "BULAR", 
    "CAIDA", "CAIDO", "CAIRO", "CALVO", "CESTA", "CHAPA", "CHILE", "CIBER", 
    "CLONE", "COLAR", "COMER", "CONTE", "COPOS", "COVAR", "CUIDA", "DEDAO", 
    "DENSO", "DRENA", "VERME", "VERTE", "VINIL", "VIVEU", "VOTAI", "VERGA", 
    "DROGA", "DUMAS", "EFEBO", "ELEVA", "ELFOA", "EMANA", "EMITA", "ENCHE", 
    "ENSOP", "ESMOA", "ESTER", "ESTRE", "EXALA", "EXTRA", "FACAO", "FACEO", 
    "FATUO", "FAVOR", "FENDI", "FERIA", "FERIR", "FEUDO", "FICHU", "FILAO", 
    "FINDO", "FINES", "FIXAR", "FLORE", "FLUOR", "FORRO", "FOSCO", "FRAGA", 
    "FREIR", "FUGIU", "FUGAZ", "FUNIL", "FUROR", "FUSAO", "GENIO", "GEMER", 
    "GESTA", "GIRAR", "GRATA", "GRATO", "GUARD", "IDEAL", "IMAGE", "IMITA", 
    "JASPE", "JURAR", "LACRE", "LADRA", "LADRO", "LAMAO", "LEITE", "LENTO", 
    "LETAL", "LIMBO", "LITRO", "LIXAO", "LIXAR", "LOUCA", "LOURO", "LUCAS", 
    "MACIO", "MAMAR", "MAMON", "MANTA", "MARTE", "MASSA", "MATAR", "MEXER", 
    "MIXTO", "MOEDA", "MONTE", "MOURA", "MUGIR", "MUTUA", "MUTUO", "NABOS", 
    "NATAL", "NEVAR", "NISSO", "NOBRE", "NORTE", "NULOS", "OCASO", "ODIAI", 
    "ORGAO", "PASTA", "PASMO", "PERNA", "PIADA", "PINHO", "PIXEL", "PLACA", 
    "POVOA", "PRAIA", "PRAGA", "PUDIM", "PUNIR", "PURGA", "QUEIX", "QUILO", 
    "RADAR", "RAMAL", "REBOC", "REGAI", "REGRA", "REPRO", "REUNU", "ROCHA", 
    "RODAR", "RONDA", "RONCO", "ROUPA", "SALMO", "SALTO", "SELIM", 
    "SENIL", "SERIA", "SERIO", "SIGNO", "SUTIL", "SUECO", "SUPOR", "TALCO", 
    "TELAS", "TENOR", "TERCO", "TODOS", "TORNA", "TORPE", "TRAIR", "VANDA", 
    "TREVO", "TRUPE", "TUDO", "UNHAS", "USINA", "VALIDA", "VALOR", "PRATO",
    "PODRE", "TENTE","SENHA","CHOVE","CHATO","BOLHA","BRUTO","VINHO","GALHO",
    "GANHO","GARRA","TROTE","BARRA","CENSO","CABRA","MILHA",
];

const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];

// Estado do jogo
let targetWord = "";
let guesses = [];
let currentGuess = "";
let currentRow = 0;
let gameOver = false;
let isRevealing = false;
let keyStatuses = {};

// Elementos DOM
const gameBoard = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
const gameMessage = document.getElementById("game-message");
const resetBtn = document.getElementById("reset-btn");
const playAgainBtn = document.getElementById("play-again-btn");

// Inicialização
function init() {
    targetWord = getRandomWord();
    guesses = [];
    currentGuess = "";
    currentRow = 0;
    gameOver = false;
    isRevealing = false;
    keyStatuses = {};
    
    createBoard();
    createKeyboard();
    hideMessage();
    playAgainBtn.classList.add("hidden");
    
    console.log("Palavra secreta:", targetWord); // Para debug
}

function getRandomWord() {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

function isValidWord(word) {
    return WORD_LIST.includes(word.toUpperCase());
}

// Criar tabuleiro
function createBoard() {
    gameBoard.innerHTML = "";
    
    for (let row = 0; row < 6; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "board-row";
        rowDiv.id = `row-${row}`;
        
        for (let col = 0; col < 5; col++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.id = `tile-${row}-${col}`;
            rowDiv.appendChild(tile);
        }
        
        gameBoard.appendChild(rowDiv);
    }
}

// Criar teclado
function createKeyboard() {
    keyboard.innerHTML = "";
    
    KEYBOARD_ROWS.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        
        row.forEach(key => {
            const keyBtn = document.createElement("button");
            keyBtn.className = "key";
            keyBtn.id = `key-${key}`;
            keyBtn.textContent = key;
            
            if (key === "ENTER" || key === "⌫") {
                keyBtn.classList.add("wide");
            }
            
            // Adicionar status de cor da tecla se já existir
            if (keyStatuses[key]) {
                keyBtn.classList.add(keyStatuses[key]);
            }
            
            keyBtn.addEventListener("click", () => handleKeyClick(key));
            rowDiv.appendChild(keyBtn);
        });
        
        keyboard.appendChild(rowDiv);
    });
}

// Atualizar display do tabuleiro
function updateBoard() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
            const tile = document.getElementById(`tile-${row}-${col}`);
            
            if (row < currentRow) {
                // Linhas já jogadas
                const guess = guesses[row];
                const letter = guess[col];
                tile.textContent = letter;
                // A classe final é definida na revelação, mas aqui garantimos que o texto esteja certo.
                // O status de cor já deve ter sido definido no revealRow.
                // Se a classe não foi setada, re-aplica o status para garantir a visualização
                if (!tile.className.includes("correct") && !tile.className.includes("present") && !tile.className.includes("absent")) {
                    tile.className = "tile " + getTileStatus(letter, col, guess);
                }
            } else if (row === currentRow) {
                // Linha atual (Digitando)
                const letter = currentGuess[col] || "";
                tile.textContent = letter;
                // Mantém a classe "filled" enquanto o usuário digita
                tile.className = letter ? "tile filled" : "tile";
            } else {
                // Linhas futuras
                tile.textContent = "";
                tile.className = "tile";
            }
        }
    }
}

// Determinar status do tile
function getTileStatus(letter, index, word) {
    const targetLetter = targetWord[index];
    
    if (letter === targetLetter) {
        return "correct";
    }
    
    // Lógica Wordle/Termo para 'present' (amarelo) e 'absent' (cinza)
    const targetArray = targetWord.split("");
    
    // 1. Contagem de ocorrências da letra na palavra secreta
    const letterCountInTarget = targetArray.filter(l => l === letter).length;
    
    // 2. Contagem de acertos 'correct' para esta letra na tentativa (para não dar amarelo em excesso)
    const correctCount = word.split("").filter((l, i) => l === letter && targetArray[i] === letter).length;
    
    // 3. Contagem de 'present' já concedidos ANTES da posição atual
    const presentCountBefore = word.slice(0, index).split("").filter((l, i) => 
        l === letter && targetArray[i] !== letter && targetArray.includes(letter)
    ).length;
    
    // 4. Se a letra existe na palavra secreta E o número de 'correct' e 'present' (antes desta posição) 
    // for menor que o total de ocorrências da letra na palavra secreta, ela é 'present'.
    if (targetArray.includes(letter) && (correctCount + presentCountBefore) < letterCountInTarget) {
        return "present";
    }
    
    return "absent";
}

// Atualizar status das teclas
function updateKeyStatuses(guess) {
    guess.split("").forEach((letter, index) => {
        const currentStatus = keyStatuses[letter];
        let newStatus;
        
        if (letter === targetWord[index]) {
            newStatus = "correct";
        } else if (targetWord.includes(letter)) {
            newStatus = "present";
        } else {
            newStatus = "absent";
        }
        
        // Só atualiza se o novo status for "melhor" (correct > present > absent)
        if (
            !currentStatus ||
            (currentStatus === "absent" && newStatus !== "absent") ||
            (currentStatus === "present" && newStatus === "correct")
        ) {
            keyStatuses[letter] = newStatus;
        }
    });
    
    // Atualizar visual das teclas
    Object.keys(keyStatuses).forEach(key => {
        const keyElement = document.getElementById(`key-${key}`);
        if (keyElement) {
            keyElement.className = "key " + keyStatuses[key];
        }
    });
}

// Handler de clique nas teclas
function handleKeyClick(key) {
    if (gameOver || isRevealing) return;
    
    if (key === "ENTER") {
        submitGuess();
    } else if (key === "⌫") {
        deleteLetter();
    } else if (/^[A-Z]$/.test(key)) { // Adicionado verificação para garantir que é uma letra
        addLetter(key);
    }
}

// Adicionar letra
function addLetter(letter) {
    if (currentGuess.length < 5) {
        currentGuess += letter;
        updateBoard();
    }
}

// Deletar letra
function deleteLetter() {
    if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    }
}

// Submeter tentativa
function submitGuess() {
    if (currentGuess.length !== 5) {
        shakeRow();
        showMessage("Palavra precisa ter 5 letras!", "error");
        return;
    }
    
    if (!isValidWord(currentGuess)) {
        shakeRow();
        showMessage("Palavra não encontrada!", "error");
        return;
    }
    
    isRevealing = true;
    guesses.push(currentGuess);
    
    // Animação de revelação
    revealRow(currentRow, () => {
        updateKeyStatuses(currentGuess);
        
        if (currentGuess === targetWord) {
            gameOver = true;
            const messages = ["Genial!", "Magnífico!", "Impressionante!", "Esplêndido!", "Muito bem!", "Ufa!"];
            showMessage(messages[currentRow] || "Parabéns!", "success");
            celebrateWin();
            playAgainBtn.classList.remove("hidden");
        } else if (currentRow >= 5) {
            gameOver = true;
            showMessage(`A palavra era: ${targetWord}`, "info");
            playAgainBtn.classList.remove("hidden");
        }
        
        currentRow++;
        currentGuess = "";
        isRevealing = false;
        // Não precisa de updateBoard() aqui, pois a função revealRow já seta as classes finais.
    });
}

// Animação de revelação da linha
function revealRow(row, callback) {
    const tiles = [];
    for (let col = 0; col < 5; col++) {
        tiles.push(document.getElementById(`tile-${row}-${col}`));
    }
    
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            const letter = guesses[row][index];
            const status = getTileStatus(letter, index, guesses[row]);
            
            // Adiciona a classe 'reveal' que faz o flip
            tile.classList.add("reveal");
            
            setTimeout(() => {
                // Remove a classe 'reveal' e aplica a classe de cor (correct/present/absent)
                tile.classList.remove("reveal");
                tile.classList.remove("filled"); // Remove a classe filled
                tile.className = `tile ${status}`; // Aplica o status final
            }, 250); // Metade do tempo da animação (0.5s)
            
            if (index === 4) {
                // Chama o callback após a última animação terminar
                setTimeout(callback, 300);
            }
        }, index * 300); // 300ms de atraso entre cada tile
    });
}

// Shake na linha
function shakeRow() {
    const row = document.getElementById(`row-${currentRow}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 500);
}

// Celebração de vitória (bounce)
function celebrateWin() {
    for (let col = 0; col < 5; col++) {
        const tile = document.getElementById(`tile-${currentRow-1}-${col}`); // Usa currentRow - 1 para pegar a linha vencedora
        setTimeout(() => {
            tile.classList.add("win");
        }, col * 100);
    }
}

// Mostrar mensagem
function showMessage(text, type) {
    gameMessage.textContent = text;
    gameMessage.className = "game-message " + type;
    
    setTimeout(hideMessage, type === "info" ? 5000 : 2000);
}

// Esconder mensagem
function hideMessage() {
    gameMessage.classList.add("hidden");
}

// Event listeners
resetBtn.addEventListener("click", init);
playAgainBtn.addEventListener("click", init);

// Teclado físico
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    
    const key = e.key.toUpperCase();

    if (key === "ENTER") {
        handleKeyClick("ENTER");
    } else if (key === "BACKSPACE") {
        handleKeyClick("⌫");
    } else if (/^[A-Z]$/.test(key) && key.length === 1) {
        handleKeyClick(key);
    }
});

// Iniciar jogo
init();