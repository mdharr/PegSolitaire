// script.js
document.addEventListener("DOMContentLoaded", function() {
    let board = [
        [-1, -1, 1, 1, 1, -1, -1],
        [-1, -1, 1, 1, 1, -1, -1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [-1, -1, 1, 1, 1, -1, -1],
        [-1, -1, 1, 1, 1, -1, -1]
    ];

    const initialBoard = JSON.parse(JSON.stringify(board));
    const gameBoard = document.getElementById("game-board");
    const restartButton = document.getElementById("restart-button");

    function renderBoard() {
        gameBoard.innerHTML = "";
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const peg = document.createElement("div");
                if (cell === 1) {
                    peg.className = "peg";
                    peg.addEventListener("click", () => selectPeg(rowIndex, cellIndex));
                } else if (cell === 0) {
                    peg.className = "peg empty";
                    peg.addEventListener("click", () => movePeg(rowIndex, cellIndex));
                } else {
                    peg.className = "peg hidden";
                }
                peg.dataset.row = rowIndex;
                peg.dataset.col = cellIndex;
                gameBoard.appendChild(peg);
            });
        });
    }

    let selectedPeg = null;

    function selectPeg(row, col) {
        if (selectedPeg) {
            document.querySelector(`[data-row="${selectedPeg.row}"][data-col="${selectedPeg.col}"]`).classList.remove('selected');
        }
        selectedPeg = { row, col };
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
    }

    function movePeg(row, col) {
        if (selectedPeg && isValidMove(selectedPeg, { row, col })) {
            makeMove(selectedPeg, { row, col });
            selectedPeg = null;
            renderBoard();
        } else {
            selectedPeg = null;
            renderBoard();
        }
    }

    function isValidMove(from, to) {
        const rowDiff = Math.abs(from.row - to.row);
        const colDiff = Math.abs(from.col - to.col);
        if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
            const midRow = (from.row + to.row) / 2;
            const midCol = (from.col + to.col) / 2;
            return board[to.row][to.col] === 0 && board[midRow][midCol] === 1;
        }
        return false;
    }

    function makeMove(from, to) {
        board[to.row][to.col] = 1;
        board[from.row][from.col] = 0;
        const midRow = (from.row + to.row) / 2;
        const midCol = (from.col + to.col) / 2;
        board[midRow][midCol] = 0;
    }

    function resetBoard() {
        board = JSON.parse(JSON.stringify(initialBoard));
        selectedPeg = null;
        renderBoard();
    }

    restartButton.addEventListener("click", resetBoard);

    renderBoard();
});
