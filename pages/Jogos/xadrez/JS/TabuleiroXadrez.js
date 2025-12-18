let playerColor = null;
let engineLevel = 1;
let gameMode = null; // 'cpu' | 'pvp'



const container = document.getElementById('board');
const TAMANHO_GRADE = 8;
const NUM_CELULAS = TAMANHO_GRADE * TAMANHO_GRADE;
const colunasLetras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let enPassantTarget = null;
let currentTurn = 'white';
let positionHistory = {};
let halfMoveClock = 0;


// 1. MOVIDO PARA FORA DO LOOP: imgpath
const imgpath = {
    'black': {
        'pawn': './img/peãoPreto.png',
        'rook': './img/torrePreto.png',
        'knight': './img/cavaloPreto.png',
        'bishop': './img/bispoPreto.png',
        'queen': './img/rainhaPreto.png',
        'king': './img/reiPreto.png',
    },
    'white': {
        'pawn': './img/peãoBranco.png',
        'rook': './img/torreBranco.png',
        'knight': './img/cavaloBranco.png',
        'bishop': './img/bispoBranco.png',
        'queen': './img/rainhaBranco.png',
        'king': './img/reiBranco.png',
    }
};

//ver quais peças se moveram para implementar o roque
const movedPieces = {
    'white-king': false,
    'black-king': false,
    'white-rook-A': false,
    'white-rook-H': false,
    'black-rook-A': false,
    'black-rook-H': false
};


// 3. ADICIONADO: Funções Utilitárias de Coordenadas
const idtopos = (id) => {
    // id é a coordenada string, ex: "A1" ou "H8"
    const fileChar = id.charAt(0); // 'A'
    const rankNum = parseInt(id.charAt(1)); // 1 ou 8
    
    // Converte para coordenadas de array:
    const x = 8 - rankNum; // 8 -> 0, 1 -> 7
    const y = fileChar.charCodeAt(0) - 65; // A -> 0, H -> 7

    return { x: x, y: y };
};

const postoid = (pos) => {
    // pos é a posição do array {x, y}
    const fileChar = String.fromCharCode(65 + pos.y); // 0 -> A
    const rankNum = 8 - pos.x; // 0 -> 8
    return fileChar + rankNum;
};

const posinbounds = (pos) => {
    return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
};

const getPieceAtPos = (pos) => {
    if (!posinbounds(pos)) return null;
    const id = postoid(pos); 
    const cell = document.querySelector(`[data-coordenada="${id}"]`);
    if (cell && cell.querySelector('img')) {
        const imgAlt = cell.querySelector('img').alt.split(' '); 
        return { 
            // Retorna a string pura da cor e tipo (ex: 'white', 'pawn')
            color: imgAlt[0], 
            type: imgAlt[1] 
        };
    }
    return null; 
};


// --- CÓDIGO DE CRIAÇÃO DO TABULEIRO ---
for (let i = 0; i < NUM_CELULAS; i++) {
    const celula = document.createElement('div');
    celula.classList.add('celula');

    const linha = Math.floor(i / TAMANHO_GRADE);
    const coluna = i % TAMANHO_GRADE;
    if ((linha + coluna) % 2 === 0) {
        celula.classList.add('white');
    } else {
        celula.classList.add('black');
    }

    // Código das coordenadas e posicionamento de peças (mantido)
    const letraColuna = colunasLetras[coluna];
    const numeroLinha = 8 - linha; 
    const coordenada = `${letraColuna}${numeroLinha}`;
    celula.setAttribute('data-coordenada', coordenada);

    let tipoPeca = null;
    let corPeca = null;

    if (linha === 1) { tipoPeca = 'pawn'; corPeca = 'black'; } 
    else if (linha === 6) { tipoPeca = 'pawn'; corPeca = 'white'; } 
    else if (linha === 0 || linha === 7) {
        corPeca = (linha === 0) ? 'black' : 'white';
        if (coluna === 0 || coluna === 7) tipoPeca = 'rook'; 
        if (coluna === 1 || coluna === 6) tipoPeca = 'knight';
        if (coluna === 2 || coluna === 5) tipoPeca = 'bishop'; 
        if (coluna === 3) tipoPeca = 'queen';
        if (coluna === 4) tipoPeca = 'king'; 
    }

    if (tipoPeca && corPeca) {
        const img = document.createElement('img');
        img.src = imgpath[corPeca][tipoPeca];
        img.alt = `${corPeca} ${tipoPeca}`; // Importante: alt="black pawn"
        celula.appendChild(img);
    }
    container.appendChild(celula);
}


// --- LÓGICA DE MOVIMENTO E REGRAS ---
let selectedPieceElement = null;
let selectedCell = null;        
let validMoves = [];

container.addEventListener('click', handleBoardClick);

function handleBoardClick(event) {
    const clickedCell = event.target.closest('.celula');
    if (!clickedCell) return; 

    // 5. CORRIGIDO/ADICIONADO: Define targetCoords aqui para ser acessível
    const targetCoords = clickedCell.getAttribute('data-coordenada');

    if (!selectedCell) { 
        const piece = clickedCell.querySelector('img'); 
if (piece) {
    const [pieceColor] = piece.alt.split(' ');
    if (pieceColor !== currentTurn) return;
            selectedPieceElement = piece; 
            selectedCell = clickedCell;
            selectedCell.classList.add('selected');

            // 2. CORRIGIDO: Extração correta de tipo e cor do atributo alt
            const pieceAlt = piece.alt.split(' ');
            const pieceType = pieceAlt[1];

let rawMoves = getValidMoves(targetCoords, pieceType, pieceColor);
validMoves = filterMovesThatExposeKing(rawMoves, clickedCell, pieceColor);


validMoves = rawMoves.filter(coord => {
    const targetCell = document.querySelector(
        `[data-coordenada="${coord}"]`
    );
    return !wouldLeaveKingInCheck(selectedCell, targetCell, pieceColor);
});
            highlightValidMoves(validMoves); 
        }
    } else { // SEGUNDO CLIQUE

        if (validMoves.includes(targetCoords)) {
            movePiece(selectedCell, clickedCell);
        } else if (clickedCell === selectedCell) {
             // Clicou na mesma peça, apenas desmarca
        } else {
            // Clicou em uma casa inválida, ignore ou emita um som de erro
            console.log("Movimento inválido!");
        }
        
        // Limpa a seleção e os destaques
        selectedCell.classList.remove('selected');
        dehighlightValidMoves();
        selectedPieceElement = null;
        selectedCell = null;
        validMoves = [];
    }
}

let selectedOriginCell = null;

function handleCellClick(cell) {
    const piece = cell.querySelector('img');

    // 🔹 1. Selecionar peça
    if (!selectedPieceElement) {
        if (piece && piece.color === currentPlayer) {
            selectedPieceElement = piece;
            selectedOriginCell = cell;
            showPossibleMoves(cell.dataset.coordenada);
        }
        return;
    }

    // 🔹 2. Mover peça
    if (selectedPieceElement && cell !== selectedOriginCell) {
        movePiece(selectedOriginCell, cell);
        selectedPieceElement = null;
        selectedOriginCell = null;
        clearHighlights();
    }
}


function movePiece(originCell, destinationCell) {
    const movedPiece = selectedPieceElement;
    const [color, type] = movedPiece.alt.split(' ');
    const enemyColor = color === 'white' ? 'black' : 'white';

    const from = originCell.dataset.coordenada;
    const to   = destinationCell.dataset.coordenada;

    // ================= TRAVA DE SEGURANÇA =================
    const legalMoves = getValidMoves(from, type, color);
    if (!legalMoves.includes(to)) return;
    // ======================================================

    // ================= ROQUE =================
    if (
        type === 'king' &&
        from[0] === 'E' &&
        (to[0] === 'G' || to[0] === 'C')
    ) {
        const rank = from[1];
        const rookFrom = to[0] === 'G' ? `H${rank}` : `A${rank}`;
        const rookTo   = to[0] === 'G' ? `F${rank}` : `D${rank}`;

        const rookFromCell = document.querySelector(`[data-coordenada="${rookFrom}"]`);
        const rookToCell   = document.querySelector(`[data-coordenada="${rookTo}"]`);
        const rookPiece = rookFromCell?.querySelector('img');

        if (!rookPiece || rookPiece.alt !== `${color} rook`) return;

        originCell.innerHTML = '';
        destinationCell.innerHTML = '';
        rookToCell.innerHTML = '';

        destinationCell.appendChild(movedPiece);
        rookToCell.appendChild(rookPiece);

        movedPieces[`${color}-king`] = true;
        if (rookFrom[0] === 'A') movedPieces[`${color}-rook-A`] = true;
        if (rookFrom[0] === 'H') movedPieces[`${color}-rook-H`] = true;

        enPassantTarget = null;
        updateCheckVisuals();
    }
    // =======================================

    // ================= EXECUTA EN PASSANT =================
    if (
        type === 'pawn' &&
        enPassantTarget &&
        to === enPassantTarget.square
    ) {
        const capturedRank = color === 'white'
            ? Number(to[1]) - 1
            : Number(to[1]) + 1;

        const capturedCell = document.querySelector(
            `[data-coordenada="${to[0]}${capturedRank}"]`
        );

        if (capturedCell) capturedCell.innerHTML = '';
    }
    // ======================================================
    const captured = destinationCell.querySelector('img');

    
    // ================= MOVIMENTO NORMAL =================
    originCell.innerHTML = '';
    destinationCell.innerHTML = '';
    destinationCell.appendChild(movedPiece);


    if (type === 'pawn' || captured) {
    halfMoveClock = 0;
} else {
    halfMoveClock++;
}


    // ================= MARCA EN PASSANT =================
    if (type === 'pawn' && Math.abs(Number(from[1]) - Number(to[1])) === 2) {
        const middleRank = (Number(from[1]) + Number(to[1])) / 2;
        enPassantTarget = {
            square: `${from[0]}${middleRank}`,
            pawnColor: color
        };
    } else {
        enPassantTarget = null;
    }
    // =====================================================

    if (type === 'king') movedPieces[`${color}-king`] = true;

    if (type === 'rook') {
        if (from[0] === 'A') movedPieces[`${color}-rook-A`] = true;
        if (from[0] === 'H') movedPieces[`${color}-rook-H`] = true;
    }

    updateCheckVisuals();
    currentTurn = currentTurn === 'white' ? 'black' : 'white';

    const signature = getBoardSignature();
positionHistory[signature] = (positionHistory[signature] || 0) + 1;

if (positionHistory[signature] === 3) {
    alert('EMPATE por repetição de posição');
}

if (halfMoveClock >= 100) {
    alert('EMPATE pela regra dos 50 lances');
}



    setTimeout(() => {
        if (isCheckmate(enemyColor)) {
            alert(`XEQUE-MATE! ${color.toUpperCase()} VENCEU`);
        }
    }, 300);
}





function getValidMoves(coords, type, color) {
    switch (type) {
        case 'pawn':
            return calculatePawnMoves(coords, color);
        case 'rook':
            return calculateRookMoves(coords, color);
        case 'bishop':
            return calculateBishopMoves(coords, color);
        case 'knight':
            return calculateKnightMoves(coords, color);
        case 'queen':
            return calculateQueenMoves(coords, color);
        case 'king':
            return calculateKingMoves(coords, color);
        default:
            return [];
    }
}




//=========================================================//
//=======================Movimento do peão=================//
//=========================================================//

function calculatePawnMoves(startCoords, pieceColor) {
    let moves = [];
    let startPos = idtopos(startCoords);
    let x = startPos.x;
    let y = startPos.y;

    const isBlack = (pieceColor === 'black');
    const direction = isBlack ? 1 : -1; // +1 para baixo (pretas), -1 para cima (brancas)
    const startRow = isBlack ? 1 : 6;

    // Movimento para frente (1 casa)
    let forwardOne = { x: x + direction, y: y };
    if (posinbounds(forwardOne) && !getPieceAtPos(forwardOne)) {
        moves.push(postoid(forwardOne));

        // Movimento para frente (2 casas, apenas no início)
        let forwardTwo = { x: x + 2 * direction, y: y };
        if (x === startRow && posinbounds(forwardTwo) && !getPieceAtPos(forwardTwo)) {
            moves.push(postoid(forwardTwo));
        }
    }

    // Capturas diagonais
    let captureRight = { x: x + direction, y: y + 1 };
    let pieceToCaptureRight = getPieceAtPos(captureRight);
    if (pieceToCaptureRight && pieceToCaptureRight.color !== pieceColor) {
        moves.push(postoid(captureRight));
    }
    
    let captureLeft = { x: x + direction, y: y - 1 };
    let pieceToCaptureLeft = getPieceAtPos(captureLeft);
    if (pieceToCaptureLeft && pieceToCaptureLeft.color !== pieceColor) {
        moves.push(postoid(captureLeft));
    }

// ===== EN PASSANT =====
if (enPassantTarget && enPassantTarget.pawnColor !== pieceColor) {
    const epPos = idtopos(enPassantTarget.square);

    // o peão precisa estar ao lado
    if (
        epPos.x === x + direction &&
        Math.abs(epPos.y - y) === 1
    ) {
        moves.push(enPassantTarget.square);
    }
}



    return moves;
}

//=========================================================//
//======================Movimento da torre=================//
//=========================================================//
function calculateRookMoves(startCoords, pieceColor) {
    let moves = [];
    const startPos = idtopos(startCoords);

    // Direções da torre: cima, baixo, esquerda, direita
    const directions = [
        { dx: -1, dy: 0 }, // cima
        { dx: 1, dy: 0 },  // baixo
        { dx: 0, dy: -1 }, // esquerda
        { dx: 0, dy: 1 }   // direita
    ];

    for (const dir of directions) {
        let x = startPos.x + dir.dx;
        let y = startPos.y + dir.dy;

        while (posinbounds({ x, y })) {
            const piece = getPieceAtPos({ x, y });

            if (!piece) {
                // Casa vazia → pode mover
                moves.push(postoid({ x, y }));
            } else {
                // Tem peça
                if (piece.color !== pieceColor) {
                    // Peça inimiga → pode capturar
                    moves.push(postoid({ x, y }));
                }
                // Para em qualquer peça
                break;
            }

            x += dir.dx;
            y += dir.dy;
        }
    }

    return moves;
}


//=========================================================//
//======================Movimento do bispo=================//
//=========================================================//
function calculateBishopMoves(startCoords, pieceColor) {
    let moves = [];
    const startPos = idtopos(startCoords);

    // Diagonais
    const directions = [
        { dx: -1, dy: -1 }, // cima-esquerda
        { dx: -1, dy: 1 },  // cima-direita
        { dx: 1, dy: -1 },  // baixo-esquerda
        { dx: 1, dy: 1 }    // baixo-direita
    ];

    for (const dir of directions) {
        let x = startPos.x + dir.dx;
        let y = startPos.y + dir.dy;

        while (posinbounds({ x, y })) {
            const piece = getPieceAtPos({ x, y });

            if (!piece) {
                moves.push(postoid({ x, y }));
            } else {
                if (piece.color !== pieceColor) {
                    moves.push(postoid({ x, y }));
                }
                break;
            }

            x += dir.dx;
            y += dir.dy;
        }
    }

    return moves;
}

//=========================================================//
//=====================Movimento do cavalo=================//
//=========================================================//
function calculateKnightMoves(startCoords, pieceColor) {
    let moves = [];
    const startPos = idtopos(startCoords);

    const knightMoves = [
        { dx: -2, dy: -1 },
        { dx: -2, dy: 1 },
        { dx: -1, dy: -2 },
        { dx: -1, dy: 2 },
        { dx: 1, dy: -2 },
        { dx: 1, dy: 2 },
        { dx: 2, dy: -1 },
        { dx: 2, dy: 1 }
    ];

    for (const move of knightMoves) {
        const pos = {
            x: startPos.x + move.dx,
            y: startPos.y + move.dy
        };

        if (!posinbounds(pos)) continue;

        const piece = getPieceAtPos(pos);

        if (!piece || piece.color !== pieceColor) {
            moves.push(postoid(pos));
        }
    }

    return moves;
}

//=========================================================//
//=====================Movimento da rainha=================//
//=========================================================//
function calculateQueenMoves(startCoords, pieceColor) {
    return [
        ...calculateRookMoves(startCoords, pieceColor),
        ...calculateBishopMoves(startCoords, pieceColor)
    ];
}

//=========================================================//
//=====================Movimento do rei====================//
//=========================================================//
function calculateKingMoves(startCoords, pieceColor, forAttackMap = false) {
    let moves = [];
    const startPos = idtopos(startCoords);

    const directions = [
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
        { dx: -1, dy: -1 }, { dx: -1, dy: 1 },
        { dx: 1, dy: -1 }, { dx: 1, dy: 1 }
    ];

    for (const dir of directions) {
        const pos = {
            x: startPos.x + dir.dx,
            y: startPos.y + dir.dy
        };

        if (!posinbounds(pos)) continue;

        const piece = getPieceAtPos(pos);
        if (!piece || piece.color !== pieceColor) {
            moves.push(postoid(pos));
        }
    }

    // ⛔ SE FOR MAPA DE ATAQUE, PARA AQUI
    if (forAttackMap) return moves;


// ================= ROQUE =================
const isWhite = pieceColor === 'white';
const kingMoved = movedPieces[`${pieceColor}-king`];
const enemyColor = isWhite ? 'black' : 'white';

// O rei não pode já ter se movido nem estar em xeque
if (!forAttackMap && !kingMoved && !isKingInCheck(pieceColor)) {
    const rank = isWhite ? '1' : '8';

    // ---------- ROQUE PEQUENO ----------
    const rookH = movedPieces[`${pieceColor}-rook-H`] === false;
    const f = idtopos(`F${rank}`);
    const g = idtopos(`G${rank}`);

    if (
        rookH &&
        !getPieceAtPos(f) &&
        !getPieceAtPos(g) &&
        !isSquareAttacked(f, enemyColor) &&
        !isSquareAttacked(g, enemyColor)
    ) {
        moves.push(`G${rank}`);
    }

    // ---------- ROQUE GRANDE ----------
    const rookA = movedPieces[`${pieceColor}-rook-A`] === false;
    const d = idtopos(`D${rank}`);
    const c = idtopos(`C${rank}`);
    const b = idtopos(`B${rank}`);

    if (
        rookA &&
        !getPieceAtPos(d) &&
        !getPieceAtPos(c) &&
        !getPieceAtPos(b) &&
        !isSquareAttacked(d, enemyColor) &&
        !isSquareAttacked(c, enemyColor)
    ) {
        moves.push(`C${rank}`);
    }
}
// =======================================


    return moves;
}

//verificar se está em xeque
function isKingInCheck(color) {
    const kingPos = findKing(color);
    if (!kingPos) return false;

    const enemyColor = color === 'white' ? 'black' : 'white';
    const enemyPieces = document.querySelectorAll(`img[alt^="${enemyColor}"]`);

    for (const piece of enemyPieces) {
        const cell = piece.closest('.celula');
        const coords = cell.dataset.coordenada;
        const [, type] = piece.alt.split(' ');

let moves;

if (type === 'king') {
    moves = calculateKingMoves(coords, enemyColor, true);
} else {
    moves = getValidMoves(coords, type, enemyColor);
}
        if (moves.includes(postoid(kingPos))) {
            return true;
        }
    }

    return false;
}


function findKing(color) {
    const kingImg = document.querySelector(`img[alt="${color} king"]`);
    if (!kingImg) return null;

    const cell = kingImg.closest('.celula');
    return idtopos(cell.dataset.coordenada);
}


function isSquareAttacked(pos, byColor) {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const piece = getPieceAtPos({ x, y });
            if (!piece || piece.color !== byColor) continue;

            const fromId = postoid({ x, y });
let moves;

if (piece.type === 'king') {
    moves = calculateKingMoves(fromId, piece.color, true);
} else {
    moves = getValidMoves(fromId, piece.type, piece.color);
}

            if (moves.includes(postoid(pos))) {
                return true;
            }
        }
    }
    return false;
}

function wouldLeaveKingInCheck(fromCell, toCell, pieceColor) {
    const movingPiece = fromCell.querySelector('img');
    const capturedPiece = toCell.querySelector('img');

    // Simula
    toCell.appendChild(movingPiece);
    if (capturedPiece) capturedPiece.remove();

    const inCheck = isKingInCheck(pieceColor);

    // Desfaz simulação
    fromCell.appendChild(movingPiece);
    if (capturedPiece) toCell.appendChild(capturedPiece);

    return inCheck;
}

function updateCheckVisuals() {
    document.querySelectorAll('.king-in-check')
        .forEach(el => el.classList.remove('king-in-check'));

    ['white', 'black'].forEach(color => {
        if (isKingInCheck(color)) {
            const kingImg = document.querySelector(`img[alt="${color} king"]`);
            if (kingImg) {
                kingImg.closest('.celula')
                    .classList.add('king-in-check');
            }
        }
    });
}

function filterMovesThatExposeKing(moves, fromCell, color) {
    return moves.filter(coord => {
        const toCell = document.querySelector(`[data-coordenada="${coord}"]`);

        let valid = true;
        simulateMove(fromCell, toCell, () => {
            if (isKingInCheck(color)) valid = false;
        });

        return valid;
    });
}

function simulateMove(fromCell, toCell, callback) {
    const piece = fromCell.querySelector('img');
    const captured = toCell.querySelector('img');

    if (!piece) return;

    // move temporariamente
    toCell.appendChild(piece);
    if (captured) captured.remove();

    callback();

    // desfaz exatamente o que fez
    fromCell.appendChild(piece);
    if (captured) toCell.appendChild(captured);
}


function getBoardSignature() {
    let signature = '';

    document.querySelectorAll('.celula').forEach(cell => {
        const piece = cell.querySelector('img');
        if (piece) {
            signature += `${cell.dataset.coordenada}:${piece.alt};`;
        }
    });

    signature += `turn:${currentTurn};`;
    return signature;
}



//visual
function updateCheckStatus() {
    document.querySelectorAll('.king-in-check')
        .forEach(el => el.classList.remove('king-in-check'));

    ['white', 'black'].forEach(color => {
        if (isKingInCheck(color)) {
            const kingImg = document.querySelector(`img[alt="${color} king"]`);
            if (kingImg) {
                kingImg.parentElement.classList.add('king-in-check');
            }
        }
    });
}


function isCheckmate(color) {
    if (!isKingInCheck(color)) return false;

    const pieces = document.querySelectorAll(`img[alt^="${color}"]`);

    for (const piece of pieces) {
        const cell = piece.closest('.celula');
        const coords = cell.dataset.coordenada;
        const [, type] = piece.alt.split(' ');

        const moves = getValidMoves(coords, type, color);
        const valid = filterMovesThatExposeKing(moves, cell, color);

        if (valid.length > 0) return false;
    }

    return true;
}

function isSameColorRookAt(square, color) {
    const pos = idtopos(square);
    const piece = getPieceAtPos(pos);
    return piece && piece.type === 'rook' && piece.color === color;
}



// Funções para Destaque Visual
function highlightValidMoves(moves) {
    moves.forEach(coord => {
        const cell = document.querySelector(`[data-coordenada="${coord}"]`);
        if (cell) {
            cell.classList.add('possible-move');
        }
    });
}

function dehighlightValidMoves() {
     const highlighted = document.querySelectorAll('.possible-move');
     highlighted.forEach(cell => {
         cell.classList.remove('possible-move');
     });
}

function iniciarPartida() {
  currentPlayer = 'white';

  console.log('Modo:', gameMode);
  console.log('Jogador:', playerColor);
  console.log('Engine nível:', engineLevel);

  if (gameMode === 'pvp') {
    // 1v1 local → turnos normais
    return;
  }

  if (gameMode === 'cpu' && playerColor === 'black') {
    // futuramente: engine começa
  }
}



const modal = document.getElementById('startModal');
const startBtn = document.getElementById('startGameBtn');

const modeButtons = document.querySelectorAll('.mode-options button');
const colorButtons = document.querySelectorAll('.color-options button');

const colorSection = document.getElementById('colorSection');
const engineSection = document.getElementById('engineSection');
const engineSelect = document.getElementById('engineLevel');

// === ESCOLHA DO MODO ===
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    gameMode = btn.dataset.mode;

    colorSection.style.display = 'block';

    if (gameMode === 'cpu') {
      engineSection.style.display = 'block';
    } else {
      engineSection.style.display = 'none';
      engineLevel = null;
    }

    startBtn.disabled = true;
    startBtn.classList.remove('enabled');
  });
});

// === ESCOLHA DA COR ===
colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    colorButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const choice = btn.dataset.color;
    playerColor =
      choice === 'random'
        ? Math.random() < 0.5 ? 'white' : 'black'
        : choice;

    startBtn.disabled = false;
    startBtn.classList.add('enabled');
  });
});

// === START ===
startBtn.addEventListener('click', () => {
  if (engineSelect) {
    engineLevel = Number(engineSelect.value);
  }

  modal.style.display = 'none';
  iniciarPartida();
});
