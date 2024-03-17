// tetris.js
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const EMPTY = 'black';

const pieces = [{
        color: 'cyan',
        shape: [
            [1, 1, 1, 1],
        ],
    },
    {
        color: 'blue',
        shape: [
            [1, 1],
            [1, 1],
        ],
    },
    {
        color: 'orange',
        shape: [
            [1, 1, 1],
            [1, 0, 0],
        ],
    },
    {
        color: 'yellow',
        shape: [
            [1, 1],
            [1, 1],
        ],
    },
    {
        color: 'green',
        shape: [
            [0, 1, 1],
            [1, 1, 0],
        ],
    },
    {
        color: 'purple',
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
    },
    {
        color: 'red',
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
    },
];

const board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(EMPTY));
let currentPiece;
let currentPieceX;
let currentPieceY;
let score = 0;
//let scoreHistory = [];

function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeStyle = 'black';
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            if (board[row][col] !== EMPTY) {
                drawBlock(col, row, board[row][col]);
            }
        }
    }
}

function spawnPiece() {
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = randomPiece.shape;
    currentPiece.color = randomPiece.color;
    currentPieceX = Math.floor(COLUMNS / 2) - Math.floor(currentPiece[0].length / 2);
    currentPieceY = 0;
}

function drawPiece() {
    currentPiece.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block) {
                drawBlock(currentPieceX + x, currentPieceY + y, currentPiece.color);
            }
        });
    });
}

function isValidMove(piece, x, y) {
    for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
            if (piece[row][col]) {
                const boardX = x + col;
                const boardY = y + row;

                if (
                    boardX < 0 ||
                    boardX >= COLUMNS ||
                    boardY >= ROWS ||
                    (boardY >= 0 && board[boardY][boardX] !== EMPTY)
                ) {
                    return false;
                }
            }
        }
    }
    return true;
}

function mergePiece() {
    currentPiece.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block) {
                const boardX = currentPieceX + x;
                const boardY = currentPieceY + y;
                board[boardY][boardX] = currentPiece.color;
            }
        });
    });
}

function initGame() {
    score = 0
    document.getElementById('score').innerText = 'Score: ' + score;
    board.forEach((row) => row.fill(EMPTY));
    spawnPiece();
}

function clearRows() {
    let rowsCleared = +0;
    for (let row = ROWS - 1; row >= 0;) {
        if (board[row].every((block) => block !== EMPTY)) {
            board.splice(row, 1);
            board.unshift(Array(COLUMNS).fill(EMPTY));
            rowsCleared++;
        } else {
            row--;
        }
    }
    const scoreSound = document.getElementById('score-sound');
    scoreSound.play();
    const clearedScore = rowsCleared * 100;
    score += clearedScore;
    document.getElementById('score').innerText = 'Score: ' + score;
    return clearedScore;
}

function movePieceLeft() {
    if (isValidMove(currentPiece, currentPieceX - 1, currentPieceY)) {
        currentPieceX--;
    }
}

function movePieceRight() {
    if (isValidMove(currentPiece, currentPieceX + 1, currentPieceY)) {
        currentPieceX++;
    }
}

function rotatePiece() {
    const rotateSound = document.getElementById('rotate-sound');
    rotateSound.play();
    const rotatedPiece = [];
    for (let col = 0; col < currentPiece[0].length; col++) {
        const newRow = [];
        for (let row = currentPiece.length - 1; row >= 0; row--) {
            newRow.push(currentPiece[row][col]);
        }
        rotatedPiece.push(newRow);
    }

    if (isValidMove(rotatedPiece, currentPieceX, currentPieceY)) {
        currentPiece = rotatedPiece;
    }
}

function dropPiece() {
    if (isValidMove(currentPiece, currentPieceX, currentPieceY + 1)) {
        currentPieceY++;
    } else {
        mergePiece();
        const rowsCleared = clearRows();
        score += rowsCleared * 100;
        document.getElementById('score').innerText = 'Score: ' + score;
        spawnPiece();

        if (!isValidMove(currentPiece, currentPieceX, currentPieceY)) {
            alert('Game Over! Your Score: ' + score);
            board.forEach((row) => row.fill(EMPTY));
            score = 0;
            document.getElementById('score').innerText = 'Score: ' + score;
            spawnPiece();
        }
    }
}

function updateGameArea() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
    // Hapus baris dan perbarui skor di sini
    const rowsCleared = clearRows();
    score += rowsCleared * 100;
    document.getElementById('score').innerText = 'Score: ' + score++;
}



//function saveScore() {
//    if (score > 0) {
//        scoreHistory.push(score); // Simpan skor saat ini ke dalam riwayat skor
//        alert('Skor Anda telah disimpan!');
//    } else {
//        alert('Skor Anda harus lebih dari 0 untuk dapat disimpan.');
//    }
//}


//function viewScoreHistory() {
//    if (scoreHistory.length > 0) {
//        const scoreHistoryString = scoreHistory.join(', ');
//        alert('Riwayat Skor: ' + scoreHistoryString);
//    } else {
//        alert('Tidak ada riwayat skor yang tersimpan.');
//    }
//}




// Temukan elemen-elemen kontrol sentuh
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const rotateButton = document.getElementById('rotate-button');
const downButton = document.getElementById('down-button');

// Tambahkan event listener untuk setiap tombol kontrol
leftButton.addEventListener('click', () => {
    movePieceLeft(); // Panggil fungsi untuk menggerakkan ke kiri
    updateGameArea(); // Perbarui tampilan permainan
});

rightButton.addEventListener('click', () => {
    movePieceRight(); // Panggil fungsi untuk menggerakkan ke kanan
    updateGameArea(); // Perbarui tampilan permainan
});

rotateButton.addEventListener('click', () => {
    rotatePiece(); // Panggil fungsi untuk memutar bentuk
    updateGameArea(); // Perbarui tampilan permainan
});

downButton.addEventListener('click', () => {
    dropPiece(); // Panggil fungsi untuk menggerakkan ke bawah
    updateGameArea(); // Perbarui tampilan permainan
});






function startGame() {
    score = 0; // Inisialisasi skor ke 0
    board.forEach((row) => row.fill(EMPTY));
    spawnPiece();

    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 37: // Left Arrow
                movePieceLeft();
                break;
            case 39: // Right Arrow
                movePieceRight();
                break;
            case 38: // Up Arrow
                rotatePiece();
                break;
            case 40: // Down Arrow
                dropPiece();
                break;
        }
        updateGameArea();
    });

    // Mulai game loop dan simpan interval ke dalam gameInterval
    gameInterval = setInterval(() => {
        dropPiece();
        updateGameArea();
    }, 500);
}


function stopGame() {
    clearInterval(gameInterval); // Hentikan game loop

    // Tindakan lain yang diperlukan untuk menghentikan permainan
}



//document.getElementById('save-score-button').addEventListener('click', function() {
//    saveScore(); // Panggil fungsi saveScore() saat tombol ditekan
// });

//document.getElementById('view-score-history-button').addEventListener('click', function() {
//    viewScoreHistory(); // Panggil fungsi viewScoreHistory() saat tombol ditekan
// });



document.getElementById('start-button').addEventListener('click', function() {
    initGame();
    startGame();
});



// Di dalam fungsi startGame(), setelah event listener lainnya
document.getElementById('stop-button').addEventListener('click', function() {
    stopGame();
});