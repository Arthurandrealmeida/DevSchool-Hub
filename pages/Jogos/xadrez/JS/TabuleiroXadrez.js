// --- VARIÁVEIS GLOBAIS ---
let engineLevel = 1;
let gameMode = 'local'; // Começa como local por padrão
let draggedPiece = null;
let origemCell = null;
let isDragging = false;
let moveCount = 0;
let notationHistory = [];
let playerColor = 'white'; 
let moveNumber = 1;
let gameOver = false;

// Selecione apenas o que realmente existe no HTML
const btnAbandonar = document.getElementById('btnAbandonar');
const container = document.getElementById('board');
let selectedMode = null;

const TAMANHO_GRADE = 8;
const NUM_CELULAS = TAMANHO_GRADE * TAMANHO_GRADE;
const colunasLetras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let enPassantTarget = null;
let currentTurn = 'white';
let positionHistory = {};
let halfMoveClock = 0;


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
    celula.classList.add((linha + coluna) % 2 === 0 ? 'white' : 'black');

    const letraColuna = colunasLetras[coluna];
    const numeroLinha = 8 - linha;
    celula.dataset.coordenada = `${letraColuna}${numeroLinha}`;

    let tipoPeca = null;
    let corPeca = null;

    if (linha === 1) { tipoPeca = 'pawn'; corPeca = 'black'; }
    else if (linha === 6) { tipoPeca = 'pawn'; corPeca = 'white'; }
    else if (linha === 0 || linha === 7) {
        corPeca = linha === 0 ? 'black' : 'white';
        if (coluna === 0 || coluna === 7) tipoPeca = 'rook';
        if (coluna === 1 || coluna === 6) tipoPeca = 'knight';
        if (coluna === 2 || coluna === 5) tipoPeca = 'bishop';
        if (coluna === 3) tipoPeca = 'queen';
        if (coluna === 4) tipoPeca = 'king';
    }

    // ✅ DRAG OVER
    celula.addEventListener('dragover', e => e.preventDefault());

    // ✅ DROP
    celula.addEventListener('drop', e => {
    e.preventDefault();
    if (!draggedPiece || !origemCell) return;

    movePiece(origemCell, celula);
});


    if (tipoPeca && corPeca) {
        const img = document.createElement('img');
        img.src = imgpath[corPeca][tipoPeca];
        img.alt = `${corPeca} ${tipoPeca}`;
        img.classList.add('piece');
        img.draggable = true;
        celula.appendChild(img);
    }

    container.appendChild(celula);
}


document.addEventListener('dragstart', e => {
    if (!e.target.classList.contains('piece')) return;

    const [color] = e.target.alt.split(' ');
    
    // Se não for a vez da cor, cancela o arrasto
    if (color !== currentTurn) {
        e.preventDefault();
        return;
    }

    draggedPiece = e.target;
    origemCell = draggedPiece.parentElement;
});

document.addEventListener('dragend', () => {
    draggedPiece = null;
});




// --- LÓGICA DE MOVIMENTO E REGRAS ---
let selectedPieceElement = null;
let selectedCell = null;        
let validMoves = [];

container.addEventListener('click', handleBoardClick);

function handleBoardClick(event) {
    if (isDragging) return;
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
    const movedPiece = originCell.querySelector('img');
    if (gameOver || !movedPiece) return;

    const [color, type] = movedPiece.alt.split(' ');
    if (color !== currentTurn) return;

    const from = originCell.dataset.coordenada;
    const to = destinationCell.dataset.coordenada;

    const rawMoves = getValidMoves(from, type, color);
    if (!rawMoves.includes(to)) return;

    if (wouldLeaveKingInCheck(originCell, destinationCell, color)) return;

    const captured = destinationCell.querySelector('img');

let oldEnPassantTarget = enPassantTarget; 
    // === DENTRO DA FUNÇÃO movePiece, ANTES DE MOVER A PEÇA ===
if (type === 'pawn' && enPassantTarget && to === enPassantTarget.square) {
    const toPos = idtopos(to);
    const direction = color === 'white' ? 1 : -1; // Brancas capturam p/ cima, então o alvo está p/ baixo (+1)
    
    const pawnToCaptureCoords = postoid({ x: toPos.x + direction, y: toPos.y });
    const pawnToCaptureCell = document.querySelector(`[data-coordenada="${pawnToCaptureCoords}"]`);
    
    if (pawnToCaptureCell) {
        pawnToCaptureCell.innerHTML = ''; // Remove o peão adversário
        console.log("Captura En Passant realizada em: " + pawnToCaptureCoords);
    }
}

enPassantTarget = null;


    // === LÓGICA DO ROQUE (Mover a Torre junto com o Rei) ===
    if (type === 'king' && Math.abs(idtopos(from).y - idtopos(to).y) === 2) {
        const isKingside = to.startsWith('G');
        const rank = color === 'white' ? '1' : '8';
        const rookFromCoords = isKingside ? `H${rank}` : `A${rank}`;
        const rookToCoords = isKingside ? `F${rank}` : `D${rank}`;
        
        const rookFromCell = document.querySelector(`[data-coordenada="${rookFromCoords}"]`);
        const rookToCell = document.querySelector(`[data-coordenada="${rookToCoords}"]`);
        const rookImg = rookFromCell.querySelector('img');
        
        rookToCell.appendChild(rookImg);
        rookFromCell.innerHTML = '';
    }

    // === EXECUÇÃO DO MOVIMENTO FÍSICO ===
    destinationCell.innerHTML = '';
    destinationCell.appendChild(movedPiece);
    originCell.innerHTML = '';

    // === ATUALIZAR ESTADOS DE MOVIMENTAÇÃO (Para impedir roque futuro) ===
    if (type === 'king') movedPieces[`${color}-king`] = true;
    if (type === 'rook') {
        if (from.startsWith('A')) movedPieces[`${color}-rook-A`] = true;
        if (from.startsWith('H')) movedPieces[`${color}-rook-H`] = true;
    }

    // === DEFINIR EN PASSANT TARGET (Para o próximo turno) ===
    enPassantTarget = null; // Reseta por padrão
    if (type === 'pawn' && Math.abs(idtopos(from).x - idtopos(to).x) === 2) {
    const fromPos = idtopos(from);
    const toPos = idtopos(to);
    const ghostX = (fromPos.x + toPos.x) / 2; // A casa que o peão pulou
    const ghostY = fromPos.y;
    
    enPassantTarget = { 
        square: postoid({ x: ghostX, y: ghostY }), 
        pawnColor: color 
    };
}

    // Finalização do turno
    const notation = generateNotation(type, from, to, !!captured);
    registerMove(notation);
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    moveCount++;

    updateGameInfo();
    updateCheckVisuals();

    const enemyColor = currentTurn;
    checkGameOver(enemyColor);

    if (isCheckmate(enemyColor)) {
        setTimeout(() => endGame(color), 200);
    }
}

function registerMove(notation) {
    const list = document.getElementById('notationList');

    if (currentTurn === 'white') {
        // Brancas → nova linha
        const li = document.createElement('li');
        li.textContent = `${moveNumber}. ${notation}`;
        list.appendChild(li);
        notationHistory.push(li);
    } else {
        // Pretas → completa a linha
        const lastLi = notationHistory[notationHistory.length - 1];
        lastLi.textContent += ` ${notation}`;
        moveNumber++;
    }
}


function generateNotation(type, from, to, capture = false) {
  const pieceLetter = {
    pawn: '',
    knight: 'N',
    bishop: 'B',
    rook: 'R',
    queen: 'Q',
    king: 'K'
  }[type];

  return `${pieceLetter}${capture ? 'x' : ''}${to}`;
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


function updateGameInfo() {
  document.getElementById('turnDisplay').textContent =
    currentTurn === 'white' ? 'Brancas' : 'Pretas';

  document.getElementById('moveCount').textContent = moveCount;
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

    // O peão atual pode capturar se o alvo estiver na diagonal imediata à frente
    if (epPos.x === x + direction && Math.abs(epPos.y - y) === 1) {
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
    gameOver = false; // 🔥 ESSENCIAL

    currentTurn = 'white';
    moveCount = 0;
    moveNumber = 1;
    notationHistory = [];

    document.getElementById('notationList').innerHTML = '';
    updateGameInfo();
}




// 1. Primeiro, pegamos todos os elementos necessários
const allModeGroups = document.querySelectorAll('.mode-group');

allModeGroups.forEach(group => {
    const card = group.querySelector('.mode-card');
    const colorOptions = group.querySelector('.color-choice');
    const groupButtons = group.querySelectorAll('.btn-choice');
    const confirmBtn = group.querySelector('.btn-confirm');

    // 2. Evento de clique no Card para mostrar as cores
    card.addEventListener('click', () => {
        // Esconde outras seleções abertas
        document.querySelectorAll('.color-choice').forEach(el => el.classList.add('hidden'));
        // Mostra a deste grupo
        colorOptions.classList.remove('hidden');
    });

    // 3. Evento de clique nos botões de cor (Branco/Preto)
    groupButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a seleção visual dos outros botões DESTE grupo
            groupButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            // Define a cor global e habilita o confirmar
            playerColor = btn.dataset.color; 
            confirmBtn.disabled = false;
            confirmBtn.classList.add('enabled');
        });
    });

    // 4. Evento de Confirmar
    // Dentro do loop allModeGroups.forEach...

confirmBtn.addEventListener('click', () => {
    // 1. Identifica o modo
    gameMode = card.innerText.includes('Bot') ? 'vs-bot' : 'local';

    // 2. Se for Bot, salva o Rating selecionado
    if (gameMode === 'vs-bot') {
        const ratingSelect = group.querySelector('#botRating');
        engineLevel = parseInt(ratingSelect.value); // Salva na variável que você já tem no topo do código
        console.log("Iniciando contra Bot nível: " + engineLevel);
    }

    startGameWithColor(playerColor);
});
});

function applyBoardOrientation() {
  const board = document.getElementById('board');

  if (playerColor === 'black') {
    board.classList.add('flipped');
  } else {
    board.classList.remove('flipped');
  }
}


const homeScreen = document.getElementById('homeScreen');
const boardContainer = document.getElementById('boardContainer');




document
  .querySelectorAll('#colorModal button[data-color]')
  .forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      playerColor = selectedColor;

      confirmColorBtn.disabled = false;
    });
  });

  

document.addEventListener('dragend', () => {
    isDragging = false;
});


// 2. OBRIGATÓRIO: Permitir que o drop aconteça
container.addEventListener('dragover', e => {
    e.preventDefault(); // Sem isso, o evento 'drop' abaixo nunca dispara
});

// --- DENTRO DO SEU LOOP DE CRIAÇÃO DO TABULEIRO ---
for (let i = 0; i < NUM_CELULAS; i++) {
    const celula = document.createElement('div');
    celula.classList.add('celula');
    
    // ... (restante do seu código de cores e coordenadas) ...

    // 1. Permitir que a célula receba o drop (Drag Over)
    celula.addEventListener('dragover', e => {
        e.preventDefault(); // OBRIGATÓRIO para o drop funcionar
    });

    // 2. O Evento de Drop (MOVA O SEU CÓDIGO PARA CÁ)
    celula.addEventListener('drop', e => {
        e.preventDefault();
        
        // Agora 'celula' está definida porque estamos dentro do loop!
        if (!origemCell || !draggedPiece) return;

        // Tenta mover a peça para ESTA célula que recebeu o drop
        movePiece(origemCell, celula);

        // Limpa as variáveis globais
        draggedPiece = null;
        origemCell = null;
    });

    container.appendChild(celula);
}

let selectedColor = null;
// --- CORREÇÃO DA LÓGICA DE INTERAÇÃO DOS MENUS ---

// 1. Variáveis que faltavam ser declaradas para não dar erro no console
const boardElement = document.getElementById('board');
const homeScreenElement = document.getElementById('homeScreen');
const boardContainerElement = document.getElementById('boardContainer');

// --- LÓGICA DE INTERAÇÃO ATUALIZADA ---

console.log("Script de botões carregado!");

document.querySelectorAll('.mode-group').forEach((group, index) => {
    const card = group.querySelector('.mode-card');
    const colorOptions = group.querySelector('.color-choice');

    if (!card || !colorOptions) {
        console.error(`Erro no grupo ${index}: Card ou Opções não encontrados!`);
        return;
    }

    card.addEventListener('click', () => {
        console.log("Você clicou no card: " + card.innerText);
        
        // Tentativa de limpar todos antes
        document.querySelectorAll('.color-choice').forEach(el => {
            el.classList.add('hidden');
            console.log("Escondendo um grupo...");
        });

        // Mostra o atual
        colorOptions.classList.remove('hidden');
        console.log("Removendo .hidden do grupo clicado. Elemento agora:", colorOptions);
    });
});

function startGameWithColor(color) {
    playerColor = color;
    
    const homeScreen = document.getElementById('homeScreen');
    const gameInfo = document.getElementById('gameInfo');
    const board = document.getElementById('board');

    // 1. Esconde o menu de seleção
    if (homeScreen) homeScreen.classList.add('hidden');

    // 2. Mostra o painel da partida
    if (gameInfo) gameInfo.classList.remove('hidden');

    // 3. Gira o tabuleiro se necessário
    if (playerColor === 'black') {
        board.classList.add('flipped');
    } else {
        board.classList.remove('flipped');
    }

    // 4. Inicia as variáveis e o tabuleiro
    iniciarPartida(); 
    
    // Se o jogador escolheu pretas e é vs-bot, o bot joga primeiro
    if (gameMode === 'vs-bot' && playerColor === 'black') {
        setTimeout(executarLanceAleatorio, 600);
    }
}

function iniciarPartida() {
    gameOver = false; // <--- OBRIGATÓRIO
    currentTurn = 'white';
    moveCount = 0;
    moveNumber = 1;
    notationHistory = [];
    document.getElementById('notationList').innerHTML = '';
    updateGameInfo();
}

function voltarParaMenu() {
    gameOver = true; // Trava movimentos enquanto limpa

    // 1. Alterna a visibilidade dos painéis
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('homeScreen').style.display = 'block';
    
    document.getElementById('gameInfo').classList.add('hidden');
    document.getElementById('boardContainer').style.display = 'none';

    // 2. Limpa o tabuleiro visualmente para a próxima vez
    const board = document.getElementById('board');
    board.innerHTML = ''; 

    console.log("Jogo resetado e voltando ao menu...");
}


// Função auxiliar para evitar que o script quebre se o botão sumir
function safeAddClick(id, callback) {
    const el = document.getElementById(id);
    if (el) {
        el.onclick = callback;
    } else {
        console.warn(`Aviso: Elemento #${id} não encontrado no HTML.`);
    }
}

// Configura o botão de abandonar
safeAddClick('btnAbandonar', () => {
    if (confirm("Tem certeza que deseja abandonar a partida?")) {
        window.location.reload();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    safeAddClick('btnAbandonar', () => {
        if (confirm("Tem certeza que deseja abandonar a partida?")) {
            console.log("Botão Voltar para Menu clicado!");
            window.location.reload();
        }
    });

    safeAddClick('btnPlayAgain', () => {
        document.getElementById('endGameModal').classList.add('hidden');
        iniciarPartida();
    });

    safeAddClick('btnBackMenu', () => {
        console.log("Botão Voltar para Menu clicado!");
        window.location.reload();
    });
});

function endGame(result, reason) {
    const modal = document.getElementById('endGameModal');
    const title = document.getElementById('endGameTitle');
    const info = document.getElementById('endGameInfo');

    if (result === 'draw') {
        title.textContent = 'Empate!';
        info.textContent = reason;
    } else {
        title.textContent = result === 'white' ? 'Vitória das Brancas' : 'Vitória das Pretas';
        info.textContent = `Vencido por ${reason}`;
    }

    modal.classList.remove('hidden');
    gameOver = true;
}

// Mude de playAgainBtn para btnPlayAgain
document.getElementById('btnPlayAgain').addEventListener('click', () => {
    document.getElementById('endGameModal').classList.add('hidden');
    iniciarPartida();
});

// Mude de backMenuBtn para btnBackMenu
document.getElementById('btnBackMenu').addEventListener('click', () => {
    voltarParaMenu();
});

function checkGameOver(enemyColor) {
    const hasMoves = playerHasLegalMoves(enemyColor);
    const inCheck = isKingInCheck(enemyColor);

    // 1. Verificação de Material Insuficiente (Apenas 2 reis)
    const todasPecas = document.querySelectorAll('.celula img');
    if (todasPecas.length === 2) {
        setTimeout(() => endGame('draw', 'Material Insuficiente (Apenas os Reis)'), 200);
        return;
    }

    // 2. Verificação de Xeque-mate ou Afogamento
    if (!hasMoves) {
        if (inCheck) {
            // Se o inimigo não tem movimentos e está em xeque, o vencedor é quem NÃO é o inimigo
            const winner = enemyColor === 'white' ? 'black' : 'white';
            setTimeout(() => endGame(winner, 'Xeque-mate'), 200);
        } else {
            // Mate por afogamento (Stalemate)
            setTimeout(() => endGame('draw', 'Mate por Afogamento'), 200);
        }
    }
}

function playerHasLegalMoves(color) {
    const pieces = document.querySelectorAll(`img[alt^="${color}"]`);
    for (const piece of pieces) {
        const cell = piece.closest('.celula');
        const coords = cell.dataset.coordenada;
        const [, type] = piece.alt.split(' ');
        
        const moves = getValidMoves(coords, type, color);
        const legalMoves = filterMovesThatExposeKing(moves, cell, color);
        
        if (legalMoves.length > 0) return true;
    }
    return false;
}