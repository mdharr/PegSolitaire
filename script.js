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

    const moves = [
        { from: { row: 5, col: 3 }, to: { row: 3, col: 3 } },
        { from: { row: 4, col: 5 }, to: { row: 4, col: 3 } },
        { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } },
        { from: { row: 6, col: 2 }, to: { row: 6, col: 4 } },
        { from: { row: 3, col: 4 }, to: { row: 5, col: 4 } },
        { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } },
        { from: { row: 1, col: 4 }, to: { row: 3, col: 4 } },
        { from: { row: 2, col: 6 }, to: { row: 2, col: 4 } },
        { from: { row: 4, col: 6 }, to: { row: 2, col: 6 } },
        { from: { row: 2, col: 3 }, to: { row: 2, col: 5 } },
        { from: { row: 2, col: 6 }, to: { row: 2, col: 4 } },
        { from: { row: 2, col: 1 }, to: { row: 2, col: 3 } },
        { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } },
        { from: { row: 0, col: 4 }, to: { row: 0, col: 2 } },
        { from: { row: 3, col: 2 }, to: { row: 1, col: 2 } },
        { from: { row: 0, col: 2 }, to: { row: 2, col: 2 } },
        { from: { row: 5, col: 2 }, to: { row: 3, col: 2 } },
        { from: { row: 4, col: 0 }, to: { row: 4, col: 2 } },
        { from: { row: 2, col: 0 }, to: { row: 4, col: 0 } },
        { from: { row: 4, col: 3 }, to: { row: 4, col: 1 } },
        { from: { row: 4, col: 0 }, to: { row: 4, col: 2 } },
        { from: { row: 2, col: 3 }, to: { row: 2, col: 1 } },
        { from: { row: 2, col: 1 }, to: { row: 4, col: 1 } },
        { from: { row: 4, col: 1 }, to: { row: 4, col: 3 } },
        { from: { row: 4, col: 3 }, to: { row: 4, col: 5 } },
        { from: { row: 4, col: 5 }, to: { row: 2, col: 5 } },
        { from: { row: 2, col: 5 }, to: { row: 2, col: 3 } },
        { from: { row: 3, col: 3 }, to: { row: 3, col: 5 } },
        { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } },
        { from: { row: 3, col: 2 }, to: { row: 3, col: 4 } },
        { from: { row: 3, col: 5 }, to: { row: 3, col: 3 } }
    ];
    

    const initialBoard = JSON.parse(JSON.stringify(board));
    const gameBoard = document.getElementById("game-board");
    const restartButton = document.getElementById("restart-button");
    const solveButton = document.getElementById("solve-button");
    const dfsSolveButton = document.getElementById("dfs-solve-button");
    const bfsSolveButton = document.getElementById("bfs-solve-button");
    const aStarSolveButton = document.getElementById("astar-solve-button");
    const scoreDisplay = document.getElementById("score-display");
    const remainingPegsDisplay = document.getElementById("remaining-display");

    let remaining = 32;
    let score = 0;

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
        updateMetaDetailsDisplay();
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
            remaining -= 1;
            score += 1;
            renderBoard();
            if (!hasPossibleMoves()) {
                alert(`Game over! No more possible moves. Final Score: ${score}.`);
            }
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
            // console.log(`Checking move from (${from.row}, ${from.col}) to (${to.row}, ${to.col}) with middle at (${midRow}, ${midCol})`);
            if (to.row >= 0 && to.row < board.length && to.col >= 0 && to.col < board[to.row].length) {
                // console.log(`Destination: ${board[to.row][to.col]}, Middle: ${board[midRow][midCol]}`);
                return board[to.row][to.col] === 0 && board[midRow][midCol] === 1;
            }
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

    function undoMove(from, to) {
        board[to.row][to.col] = 0;
        board[from.row][from.col] = 1;
        const midRow = (from.row + to.row) / 2;
        const midCol = (from.col + to.col) / 2;
        board[midRow][midCol] = 1;
    }

    function resetBoard() {
        board = JSON.parse(JSON.stringify(initialBoard));
        selectedPeg = null;
        remaining = 32;
        score = 0;
        renderBoard();
    }

    function updateMetaDetailsDisplay() {
        scoreDisplay.textContent = `Score: ${score}`;
        remainingPegsDisplay.textContent = `Remaining: ${remaining}`;
    }

    function hasPossibleMoves() {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === 1) {
                    if (isValidMove({ row, col }, { row: row - 2, col }) ||
                        isValidMove({ row, col }, { row: row + 2, col }) ||
                        isValidMove({ row, col }, { row, col: col - 2 }) ||
                        isValidMove({ row, col }, { row, col: col + 2 })) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function solveGame() {
        let moveIndex = 0;

        function makeNextMove() {
            if (moveIndex >= moves.length) {
                renderBoard();
                alert("Game solved!");
                return;
            }

            const move = moves[moveIndex];
            // console.log(`Move ${moveIndex + 1}: from (${move.from.row}, ${move.from.col}) to (${move.to.row}, ${move.to.col})`);

            if (isValidMove(move.from, move.to)) {
                makeMove(move.from, move.to);
                moveIndex++;
                renderBoard();
                setTimeout(makeNextMove, 250);
            } else {
                alert(`Invalid move detected at move ${moveIndex + 1}: from (${move.from.row}, ${move.from.col}) to (${move.to.row}, ${move.to.col})`);
            }
        }

        resetBoard();
        makeNextMove();
    }

    function isGoalState() {
        let pegCount = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === 1) {
                    pegCount++;
                }
            }
        }
        return pegCount === 1;
    }







    // Depth First Search implementation
    function solveDFS() {
        let moveHistory = [];
        function dfs() {
            if (isGoalState()) {
                return true;
            }

            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    if (board[row][col] === 1) {
                        const possibleMoves = [
                            { to: { row: row - 2, col: col }, mid: { row: row - 1, col: col } },
                            { to: { row: row + 2, col: col }, mid: { row: row + 1, col: col } },
                            { to: { row: row, col: col - 2 }, mid: { row: row, col: col - 1 } },
                            { to: { row: row, col: col + 2 }, mid: { row: row, col: col + 1 } }
                        ];

                        for (const move of possibleMoves) {
                            if (isValidMove({ row, col }, move.to)) {
                                makeMove({ row, col }, move.to);
                                moveHistory.push({ from: { row, col }, to: move.to });
                                if (dfs()) {
                                    return true;
                                }
                                undoMove({ row, col }, move.to);
                                moveHistory.pop();
                            }
                        }
                    }
                }
            }
            return false;
        }

        const start = performance.now();
        if (dfs()) {
            const end = performance.now();
            alert(`Solution found in ${(end - start).toFixed(2)} milliseconds!`);
            for (const move of moveHistory) {
                // console.log(`Move from (${move.from.row}, ${move.from.col}) to (${move.to.row}, ${move.to.col})`);
            }
        } else {
            const end = performance.now();
            alert(`No solution found. Time taken: ${(end - start).toFixed(2)} milliseconds.`);
        }
    }

    // Breadth-First Search implementation
    function solveBFS() {
        console.log('start bfs');
        const start = performance.now();
        const queue = [];
        const initialState = { board: JSON.parse(JSON.stringify(board)), moves: [] };

        queue.push(initialState);

        while (queue.length > 0) {
            const currentState = queue.shift();
            const currentBoard = currentState.board;

            if (isGoalState(currentBoard)) {
                const end = performance.now();
                alert(`Solution found in ${(end - start).toFixed(2)} milliseconds!`);
                replayMoves(currentState.moves);
                return;
            }

            for (let row = 0; row < currentBoard.length; row++) {
                for (let col = 0; col < currentBoard[row].length; col++) {
                    if (currentBoard[row][col] === 1) {
                        const possibleMoves = [
                            { to: { row: row - 2, col: col }, mid: { row: row - 1, col: col } },
                            { to: { row: row + 2, col: col }, mid: { row: row + 1, col: col } },
                            { to: { row: row, col: col - 2 }, mid: { row: row, col: col - 1 } },
                            { to: { row: row, col: col + 2 }, mid: { row: row, col: col + 1 } }
                        ];

                        for (const move of possibleMoves) {
                            if (isValidMoveBFS(currentBoard, { row, col }, move.to)) {
                                const newBoard = JSON.parse(JSON.stringify(currentBoard));
                                makeMoveBFS(newBoard, { row, col }, move.to);
                                const newMoves = [...currentState.moves, { from: { row, col }, to: move.to }];
                                queue.push({ board: newBoard, moves: newMoves });
                            }
                        }
                    }
                }
            }
        }

        const end = performance.now();
        alert(`No solution found. Time taken: ${(end - start).toFixed(2)} milliseconds.`);
    }

    function isValidMoveBFS(board, from, to) {
        const rowDiff = Math.abs(from.row - to.row);
        const colDiff = Math.abs(from.col - to.col);
        if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
            const midRow = (from.row + to.row) / 2;
            const midCol = (from.col + to.col) / 2;
            if (to.row >= 0 && to.row < board.length && to.col >= 0 && to.col < board[to.row].length) {
                return board[to.row][to.col] === 0 && board[midRow][midCol] === 1;
            }
        }
        return false;
    }

    function makeMoveBFS(board, from, to) {
        board[to.row][to.col] = 1;
        board[from.row][from.col] = 0;
        const midRow = (from.row + to.row) / 2;
        const midCol = (from.col + to.col) / 2;
        board[midRow][midCol] = 0;
    }

    function replayMoves(moves) {
        resetBoard();
        let moveIndex = 0;

        function makeNextMove() {
            if (moveIndex >= moves.length) {
                renderBoard();
                return;
            }

            const move = moves[moveIndex];
            makeMove(move.from, move.to);
            moveIndex++;
            renderBoard();
            setTimeout(makeNextMove, 250);
        }

        makeNextMove();
    }




    // A* implementation
        // Enhanced A* implementation with better heuristics and state management
        function heuristic(state) {
            let pegCount = 0;
            for (let row = 0; row < state.length; row++) {
                for (let col = 0; col < state[row].length; col++) {
                    if (state[row][col] === 1) {
                        pegCount++;
                    }
                }
            }
            return pegCount - 1;
        }
    
        function aStarSolve() {
            class PriorityQueue {
                constructor() {
                    this.items = [];
                }
    
                enqueue(element, priority) {
                    const queueElement = { element, priority };
                    let added = false;
                    for (let i = 0; i < this.items.length; i++) {
                        if (queueElement.priority < this.items[i].priority) {
                            this.items.splice(i, 0, queueElement);
                            added = true;
                            break;
                        }
                    }
                    if (!added) {
                        this.items.push(queueElement);
                    }
                }
    
                dequeue() {
                    return this.items.shift();
                }
    
                isEmpty() {
                    return this.items.length === 0;
                }
            }
    
            function copyBoard(board) {
                return board.map(row => row.slice());
            }
    
            function getNeighbors(state) {
                let neighbors = [];
                for (let row = 0; row < state.length; row++) {
                    for (let col = 0; col < state[row].length; col++) {
                        if (state[row][col] === 1) {
                            const possibleMoves = [
                                { to: { row: row - 2, col: col }, mid: { row: row - 1, col: col } },
                                { to: { row: row + 2, col: col }, mid: { row: row + 1, col: col } },
                                { to: { row: row, col: col - 2 }, mid: { row: row, col: col - 1 } },
                                { to: { row: row, col: col + 2 }, mid: { row: row, col: col + 1 } }
                            ];
    
                            for (const move of possibleMoves) {
                                if (isValidMove({ row, col }, move.to)) {
                                    const newState = copyBoard(state);
                                    makeMoveBFS(newState, { row, col }, move.to);
                                    neighbors.push(newState);
                                }
                            }
                        }
                    }
                }
                return neighbors;
            }
    
            function aStar() {
                const start = performance.now();
                const startState = copyBoard(board);
                const openSet = new PriorityQueue();
                const cameFrom = new Map();
                const gScore = new Map();
                const fScore = new Map();
    
                const startStateString = JSON.stringify(startState);
                gScore.set(startStateString, 0);
                fScore.set(startStateString, heuristic(startState));
                openSet.enqueue(startState, fScore.get(startStateString));
    
                while (!openSet.isEmpty()) {
                    const current = openSet.dequeue().element;
                    const currentString = JSON.stringify(current);
    
                    if (isGoalState(current)) {
                        const end = performance.now();
                        alert(`Solution found in ${(end - start).toFixed(2)} milliseconds!`);
                        return;
                    }
    
                    for (const neighbor of getNeighbors(current)) {
                        const tentativeGScore = gScore.get(currentString) + 1;
                        const neighborString = JSON.stringify(neighbor);
                        if (!gScore.has(neighborString) || tentativeGScore < gScore.get(neighborString)) {
                            cameFrom.set(neighborString, current);
                            gScore.set(neighborString, tentativeGScore);
                            fScore.set(neighborString, tentativeGScore + heuristic(neighbor));
                            openSet.enqueue(neighbor, fScore.get(neighborString));
                        }
                    }
                }
    
                const end = performance.now();
                alert(`No solution found. Time taken: ${(end - start).toFixed(2)} milliseconds.`);
            }
    
            aStar();
        }





    restartButton.addEventListener("click", resetBoard);
    solveButton.addEventListener("click", solveGame);
    dfsSolveButton.addEventListener("click", solveDFS);
    bfsSolveButton.addEventListener("click", solveBFS);
    aStarSolveButton.addEventListener("click", aStarSolve);

    renderBoard();
});
