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
let positionHistory = new Map();
let promotionPending = null;
let botColor = null;


// Selecione apenas o que realmente existe no HTML
const btnAbandonar = document.getElementById('btnAbandonar');
const container = document.getElementById('board');
let selectedMode = null;

const TAMANHO_GRADE = 8;
const NUM_CELULAS = TAMANHO_GRADE * TAMANHO_GRADE;
const colunasLetras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let enPassantTarget = null;
let currentTurn = 'white';
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

const pieceImageMap = {
    pawn: 'peão',
    rook: 'torre',
    knight: 'cavalo',
    bishop: 'bispo',
    queen: 'rainha',
    king: 'rei'
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

const PIECE_VALUE = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 100
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
    if (promotionPending) return;


    let [color, type] = movedPiece.alt.split(' ');
    if (color !== currentTurn) return;

    const from = originCell.dataset.coordenada;
    const to = destinationCell.dataset.coordenada;

    // 🔑 ESSA LINHA É ESSENCIAL
    const rawMoves = getValidMoves(from, type, color);
    if (!rawMoves.includes(to)) return;

if (wouldLeaveKingInCheck(originCell, destinationCell, color)) return;


    const captured = destinationCell.querySelector('img');

    // === EN PASSANT ===
    if (type === 'pawn' && enPassantTarget && to === enPassantTarget.square) {
        const toPos = idtopos(to);
        const direction = color === 'white' ? 1 : -1;
        const pawnToCapture = postoid({ x: toPos.x + direction, y: toPos.y });
        document
            .querySelector(`[data-coordenada="${pawnToCapture}"]`)
            ?.replaceChildren();
    }

    enPassantTarget = null;

    // === ROQUE ===
    if (type === 'king' && Math.abs(idtopos(from).y - idtopos(to).y) === 2) {
        const isKingside = to.startsWith('G');
        const rank = color === 'white' ? '1' : '8';
        const rookFrom = isKingside ? `H${rank}` : `A${rank}`;
        const rookTo = isKingside ? `F${rank}` : `D${rank}`;

        const rookFromCell = document.querySelector(`[data-coordenada="${rookFrom}"]`);
        const rookToCell = document.querySelector(`[data-coordenada="${rookTo}"]`);

        rookToCell.appendChild(rookFromCell.querySelector('img'));
        rookFromCell.replaceChildren();
    }

    // === MOVE ===
    destinationCell.replaceChildren(movedPiece);
    originCell.replaceChildren();

    // === PROMOÇÃO ===
    let promoted = false;
    if (type === 'pawn') {
        const finalRank = color === 'white' ? '8' : '1';
        if (to[1] === finalRank) {
promotionPending = {
    pawnImg: movedPiece,
    color,
    square: to
};

showPromotionMenu(color);
return;
            promoted = true;

            // 🔥 ATUALIZA O TYPE
            [, type] = movedPiece.alt.split(' ');
        }
    }

    const notation = generateNotation(type, from, to, !!captured, promoted);
    registerMove(notation);

    // === TRAVAR ROQUE FUTURO ===
    if (type === 'king') movedPieces[`${color}-king`] = true;
    if (type === 'rook') {
        if (from.startsWith('A')) movedPieces[`${color}-rook-A`] = true;
        if (from.startsWith('H')) movedPieces[`${color}-rook-H`] = true;
    }

    // === DEFINIR EN PASSANT ===
    if (type === 'pawn' && Math.abs(idtopos(from).x - idtopos(to).x) === 2) {
        const fromPos = idtopos(from);
        const toPos = idtopos(to);
        enPassantTarget = {
            square: postoid({ x: (fromPos.x + toPos.x) / 2, y: fromPos.y }),
            pawnColor: color
        };
    }

    currentTurn = currentTurn === 'white' ? 'black' : 'white';

    if (gameMode === 'vs-bot' && currentTurn === botColor) {
        setTimeout(botMove, 400);
    }

    registerPosition();
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

function generateNotation(type, from, to, capture, promoted = false) {
    let notation = '';

    if (type !== 'pawn') {
        notation += { rook:'R', knight:'N', bishop:'B', queen:'Q', king:'K' }[type];
    }

    if (capture) notation += 'x';

    notation += to;

    if (promoted) notation += '=Q';

    return notation;
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

function getPawnAttacks(coords, color) {
    const pos = idtopos(coords);
    const direction = color === 'white' ? -1 : 1;

    const attacks = [];

    for (const dy of [-1, 1]) {
        const target = { x: pos.x + direction, y: pos.y + dy };
        if (posinbounds(target)) {
            attacks.push(postoid(target));
        }
    }

    return attacks;
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

    const enemyColor = pieceColor === 'white' ? 'black' : 'white';

    // ---------- MOVIMENTOS NORMAIS ----------
    for (const dir of directions) {
        const pos = {
            x: startPos.x + dir.dx,
            y: startPos.y + dir.dy
        };

        if (!posinbounds(pos)) continue;

        const piece = getPieceAtPos(pos);

        // não pode capturar peça própria
        if (piece && piece.color === pieceColor) continue;

        // 🔥 rei NÃO pode ir para casa atacada
        if (!forAttackMap && isSquareAttacked(pos, enemyColor)) continue;

        moves.push(postoid(pos));
    }

    // ⛔ mapa de ataque NÃO inclui roque
    if (forAttackMap) return moves;

    // ================= ROQUE =================
    const kingMoved = movedPieces[`${pieceColor}-king`];
    if (kingMoved) return moves;

    const rank = pieceColor === 'white' ? '1' : '8';

    // ---------- ROQUE PEQUENO ----------
    if (
        movedPieces[`${pieceColor}-rook-H`] === false &&
        !getPieceAtPos(idtopos(`F${rank}`)) &&
        !getPieceAtPos(idtopos(`G${rank}`)) &&
        !isSquareAttacked(idtopos(`F${rank}`), enemyColor) &&
        !isSquareAttacked(idtopos(`G${rank}`), enemyColor)
    ) {
        moves.push(`G${rank}`);
    }

    // ---------- ROQUE GRANDE ----------
    if (
        movedPieces[`${pieceColor}-rook-A`] === false &&
        !getPieceAtPos(idtopos(`D${rank}`)) &&
        !getPieceAtPos(idtopos(`C${rank}`)) &&
        !getPieceAtPos(idtopos(`B${rank}`)) &&
        !isSquareAttacked(idtopos(`D${rank}`), enemyColor) &&
        !isSquareAttacked(idtopos(`C${rank}`), enemyColor)
    ) {
        moves.push(`C${rank}`);
    }

    return moves;
}


//verificar se está em xeque
function isKingInCheck(color) {
    const kingPos = findKing(color);
    if (!kingPos) return false;

    const enemyColor = color === 'white' ? 'black' : 'white';

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const piece = getPieceAtPos({ x, y });
            if (!piece || piece.color !== enemyColor) continue;

            const fromId = postoid({ x, y });
            let attacks;

            switch (piece.type) {
                case 'pawn':
                    attacks = getPawnAttacks(fromId, enemyColor);
                    break;
                case 'king':
                    attacks = getKingAttacks(fromId);
                    break;
                default:
                    attacks = getRawMoves(fromId, piece.type, enemyColor);
            }

            if (attacks.includes(postoid(kingPos))) {
                return true;
            }
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

function getRawMoves(coords, type, color) {
    switch (type) {
        case 'pawn':
    return getPawnAttacks(coords, color);

        case 'rook':
            return calculateRookMoves(coords, color);
        case 'bishop':
            return calculateBishopMoves(coords, color);
        case 'knight':
            return calculateKnightMoves(coords, color);
        case 'queen':
            return calculateQueenMoves(coords, color);
        case 'king':
            return calculateKingMoves(coords, color, true);
        default:
            return [];
    }
}

function isSquareAttacked(pos, byColor) {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const piece = getPieceAtPos({ x, y });
            if (!piece || piece.color !== byColor) continue;

            const fromId = postoid({ x, y });
            let attacks;

            switch (piece.type) {
                case 'pawn':
                    attacks = getPawnAttacks(fromId, piece.color);
                    break;
                case 'king':
                    attacks = getKingAttacks(fromId); // 🔥 SEM calculateKingMoves
                    break;
                default:
                    attacks = getRawMoves(fromId, piece.type, piece.color);
            }

            if (attacks.includes(postoid(pos))) {
                return true;
            }
        }
    }
    return false;
}




function wouldLeaveKingInCheck(fromCell, toCell, pieceColor) {
    const movingPiece = fromCell.querySelector('img');
    const capturedPiece = toCell.querySelector('img');

    const from = fromCell.dataset.coordenada;
    const to = toCell.dataset.coordenada;

    let rookMove = null;

    // 🔹 detectar roque
    if (
        movingPiece.alt.includes('king') &&
        Math.abs(idtopos(from).y - idtopos(to).y) === 2
    ) {
        const isKingside = to.startsWith('G');
        const rank = pieceColor === 'white' ? '1' : '8';

        const rookFrom = isKingside ? `H${rank}` : `A${rank}`;
        const rookTo = isKingside ? `F${rank}` : `D${rank}`;

        const rookFromCell = document.querySelector(`[data-coordenada="${rookFrom}"]`);
        const rookToCell = document.querySelector(`[data-coordenada="${rookTo}"]`);
        const rookImg = rookFromCell.querySelector('img');

        rookMove = { rookFromCell, rookToCell, rookImg };

        rookToCell.appendChild(rookImg);
        rookFromCell.replaceChildren();
    }

    // 🔹 simula movimento do rei
    toCell.appendChild(movingPiece);
    if (capturedPiece) capturedPiece.remove();

    const inCheck = isKingInCheck(pieceColor);

    // 🔹 desfaz rei
    fromCell.appendChild(movingPiece);
    if (capturedPiece) toCell.appendChild(capturedPiece);

    // 🔹 desfaz torre
    if (rookMove) {
        rookMove.rookFromCell.appendChild(rookMove.rookImg);
        rookMove.rookToCell.replaceChildren();
    }

    return inCheck;
}

function getKingAttacks(coords) {
    const attacks = [];
    const startPos = idtopos(coords);

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

        if (posinbounds(pos)) {
            attacks.push(postoid(pos));
        }
    }

    return attacks;
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
        const toCell = document.querySelector(
            `[data-coordenada="${coord}"]`
        );

        return !wouldLeaveKingInCheck(fromCell, toCell, color);
    });
}


function simulateMove(fromCell, toCell, callback) {
    const piece = fromCell.querySelector('img');
    const captured = toCell.querySelector('img');
    if (!piece) return;

    const [color, type] = piece.alt.split(' ');
    const from = fromCell.dataset.coordenada;
    const to = toCell.dataset.coordenada;

    let rookMove = null;

    // 🔹 SIMULA ROQUE
    if (
        type === 'king' &&
        Math.abs(idtopos(from).y - idtopos(to).y) === 2
    ) {
        const isKingside = to.startsWith('G');
        const rank = color === 'white' ? '1' : '8';

        const rookFrom = isKingside ? `H${rank}` : `A${rank}`;
        const rookTo = isKingside ? `F${rank}` : `D${rank}`;

        const rookFromCell = document.querySelector(
            `[data-coordenada="${rookFrom}"]`
        );
        const rookToCell = document.querySelector(
            `[data-coordenada="${rookTo}"]`
        );
        const rookImg = rookFromCell.querySelector('img');

        rookMove = { rookFromCell, rookToCell, rookImg };

        rookToCell.appendChild(rookImg);
        rookFromCell.replaceChildren();
    }

    // 🔹 move peça principal
    toCell.appendChild(piece);
    if (captured) captured.remove();

    callback();

    // 🔹 desfaz peça principal
    fromCell.appendChild(piece);
    if (captured) toCell.appendChild(captured);

    // 🔹 desfaz torre do roque
    if (rookMove) {
        rookMove.rookFromCell.appendChild(rookMove.rookImg);
        rookMove.rookToCell.replaceChildren();
    }
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
    botColor = playerColor === 'white' ? 'black' : 'white';
    
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
        setTimeout(botMove, 600);
    }
}

function iniciarPartida() {
    gameOver = false; // <--- OBRIGATÓRIO
    currentTurn = 'white';
    moveCount = 0;
    moveNumber = 1;
    notationHistory = [];
    
    document.getElementById('notationList').innerHTML = '';


    positionHistory.clear();
    registerPosition(); 

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

function endGame(result) {
    gameOver = true;

    const modal = document.getElementById('endGameModal');
    const title = document.getElementById('endGameTitle');
    const info = document.getElementById('endGameInfo');

    if (result === 'draw') {
        title.textContent = 'Empate por repetição';
        info.textContent = `A mesma posição ocorreu 3 vezes.`;
    } else {
        title.textContent =
            result === 'white'
                ? 'Vitória das Brancas'
                : 'Vitória das Pretas';

        info.textContent = `Partida finalizada em ${moveNumber - 1} lances.`;
    }

    modal.classList.remove('hidden');
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

function getPositionKey() {
    let key = '';

    // 1️⃣ peças no tabuleiro
    document.querySelectorAll('.celula').forEach(cell => {
        const coord = cell.dataset.coordenada;
        const piece = cell.querySelector('img');

        if (piece) {
            key += `${coord}:${piece.alt};`;
        }
    });

    // 2️⃣ vez de quem joga
    key += `turn:${currentTurn};`;

    // 3️⃣ roque
    key += `castle:${JSON.stringify(movedPieces)};`;

    // 4️⃣ en passant
    key += `ep:${enPassantTarget ? enPassantTarget.square : 'none'};`;

    return key;
}

function getPieceImage(piece, color) {
    const nome = pieceImageMap[piece];
    const cor = color === 'white' ? 'Branco' : 'Preto';
    return `img/${nome}${cor}.png`;
}


function registerPosition() {
    const key = getPositionKey();
    const count = positionHistory.get(key) || 0;
    positionHistory.set(key, count + 1);

    // 🔥 REPETIÇÃO TRIPLA
    if (count + 1 === 3) {
        endGame('draw');
    }
}

function promotePawn(pawnImg, color) {
    let choice = prompt(
        "Escolha a promoção:\nqueen, rook, bishop ou knight",
        "queen"
    );

    const validPieces = ['queen', 'rook', 'bishop', 'knight'];

    if (!validPieces.includes(choice)) {
        choice = 'queen';
    }

    pawnImg.alt = `${color} ${choice}`;
    pawnImg.src = `img/${choice}${color === 'white' ? 'Branco' : 'Preto'}.png`;
}

function showPromotionMenu(color) {
    const menu = document.getElementById('promotion-menu');

    menu.querySelectorAll('img').forEach(img => {
        const piece = img.dataset.piece;
        img.src = getPieceImage(piece, color);
    });

    menu.classList.remove('hidden');
}

document
    .getElementById('promotion-menu')
    .addEventListener('click', e => {
        if (!promotionPending) return;
        if (e.target.tagName !== 'IMG') return;

        const piece = e.target.dataset.piece;
        const { pawnImg, color } = promotionPending;

        pawnImg.alt = `${color} ${piece}`;
        pawnImg.src = getPieceImage(piece, color);

        promotionPending = null;
        document.getElementById('promotion-menu').classList.add('hidden');

        // Agora o jogo continua normalmente
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
        registerPosition();
        updateGameInfo();
        updateCheckVisuals();
    });

    document.addEventListener('mousedown', e => {
    const menu = document.getElementById('promotion-menu');

    if (
        promotionPending &&
        !menu.classList.contains('hidden') &&
        !menu.contains(e.target)
    ) {
        menu.classList.add('hidden');
        promotionPending = null;
    }
});

function botMove() {
    if (gameMode !== 'vs-bot') return;
    if (currentTurn !== botColor) return;

    const allMoves = [];
    const captureMoves = [];
    const safeCaptureMoves = [];
    const safeMoves = [];

    document.querySelectorAll('.celula').forEach(cell => {
        const img = cell.querySelector('img');
        if (!img) return;

        const [color, type] = img.alt.split(' ');
        if (color !== currentTurn) return;

        const from = cell.dataset.coordenada;
        const moves = getValidMoves(from, type, color);

        moves.forEach(to => {
            const fromCell = document.querySelector(
                `[data-coordenada="${from}"]`
            );
            const toCell = document.querySelector(
                `[data-coordenada="${to}"]`
            );

            if (wouldLeaveKingInCheck(fromCell, toCell, color)) return;

            const move = { from, to };
            allMoves.push(move);

            const targetPiece = toCell.querySelector('img');
            const enemyColor = color === 'white' ? 'black' : 'white';

            // 👉 CAPTURA
            if (targetPiece) {
                captureMoves.push(move);

                // verifica se a casa será atacada após a captura
                if (isSafeAfterMove(fromCell, toCell, color)) {
    safeCaptureMoves.push(move);
}

            } else {
                // 👉 LANCE NORMAL SEGURO
                if (isSafeAfterMove(fromCell, toCell, color)) {
    safeMoves.push(move);
}

            }
        });
    });

    if (allMoves.length === 0) return;

    let chosenMove;

// 🧠 600 ELO
if (engineLevel >= 600) {
    let bestScore = -Infinity;
    let bestMoves = [];

    allMoves.forEach(move => {
        const score = evaluateMove(
            move.from,
            move.to,
            currentTurn
        );

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        } else if (score === bestScore) {
            bestMoves.push(move);
        }
    });

    chosenMove = bestMoves[
        Math.floor(Math.random() * bestMoves.length)
    ];

// 🎯 300 ELO
} else if (engineLevel >= 300 && captureMoves.length > 0) {
    chosenMove = captureMoves[
        Math.floor(Math.random() * captureMoves.length)
    ];

// 🎲 100 ELO
} else {
    chosenMove = allMoves[
        Math.floor(Math.random() * allMoves.length)
    ];
}


    const fromCell = document.querySelector(
        `[data-coordenada="${chosenMove.from}"]`
    );
    const toCell = document.querySelector(
        `[data-coordenada="${chosenMove.to}"]`
    );

    setTimeout(() => {
        movePiece(fromCell, toCell);
    }, 400);
}


function evaluateMove(from, to, color) {
    const fromCell = document.querySelector(
        `[data-coordenada="${from}"]`
    );
    const toCell = document.querySelector(
        `[data-coordenada="${to}"]`
    );

    const movedPiece = fromCell.querySelector('img');
    const [, movedType] = movedPiece.alt.split(' ');
    const enemyColor = color === 'white' ? 'black' : 'white';

    let score = 0;

    simulateMove(fromCell, toCell, () => {

        // 👉 captura real (agora correta)
        const captured = toCell.querySelector('img');
        if (captured) {
            const [, capturedType] = captured.alt.split(' ');
            score += PIECE_VALUE[capturedType];
        }

        // 👉 recaptura real
        const recaptureValue = worstRecaptureValue(
            idtopos(to),
            enemyColor
        );

        // 🚫 nunca trocar peça maior por menor
        if (
            captured &&
            PIECE_VALUE[movedType] >
                PIECE_VALUE[captured.alt.split(' ')[1]] &&
            recaptureValue >= PIECE_VALUE[movedType]
        ) {
            score = -9999;
            return;
        }

        // 🚫 regra absoluta: dama não pode ficar atacada
        if (
            movedType === 'queen' &&
            isSquareAttacked(idtopos(to), enemyColor)
        ) {
            score = -9999;
            return;
        }

        score -= recaptureValue;
    });

    return score;
}




function worstRecaptureValue(square, enemyColor) {
    let worst = 0;

    document.querySelectorAll('.celula').forEach(cell => {
        const img = cell.querySelector('img');
        if (!img) return;

        const [color, type] = img.alt.split(' ');
        if (color !== enemyColor) return;

        const from = cell.dataset.coordenada;
const moves =
    type === 'king'
        ? calculateKingMoves(from, color, true)
        : getValidMoves(from, type, color);

        if (moves.includes(square)) {
            worst = Math.max(worst, PIECE_VALUE[type]);
        }
    });

    return worst;
}



function getAttackMoves(coords, type, color) {
    switch (type) {
        case 'pawn':
            return getPawnAttacks(coords, color);
        case 'king':
            return calculateKingMoves(coords, color, true);
        default:
            return getValidMoves(coords, type, color);
    }
}
 