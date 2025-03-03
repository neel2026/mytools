document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.querySelector('.game-board');
    const cells = document.querySelectorAll('.cell');
    const statusMessage = document.getElementById('status-message');
    const currentPlayerDisplay = document.getElementById('current-player');
    const resetButton = document.getElementById('reset-game');
    
    let currentPlayer = 'X'; // Human player is X
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (gameState[index] !== '' || !gameActive || currentPlayer !== 'X') return;

        makeMove(index);

        if (gameActive) {
            // Add slight delay before computer moves
            setTimeout(computerMove, 500);
        }
    }

    function makeMove(index) {
        gameState[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer.toLowerCase());

        // Add click animation
        cells[index].style.transform = 'scale(0.95)';
        setTimeout(() => {
            cells[index].style.transform = 'scale(1)';
        }, 100);

        checkResult();
    }

    function computerMove() {
        if (!gameActive) return;

        const bestMove = findBestMove();
        if (bestMove !== -1) {
            makeMove(bestMove);
        }
    }

    function findBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;

        // Try each available move
        for (let i = 0; i < 9; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false);
                gameState[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        // Check for terminal states
        const result = checkWinner();
        if (result !== null) {
            return result === 'O' ? 10 - depth : depth - 10;
        }
        if (!board.includes('')) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }
        return gameState.includes('') ? null : 'tie';
    }

    function checkResult() {
        const winner = checkWinner();
        
        if (winner === 'X' || winner === 'O') {
            gameActive = false;
            const winnerText = winner === 'X' ? 'You win!' : 'Computer wins!';
            statusMessage.textContent = winnerText;
            
            // Find winning combination
            for (let condition of winningConditions) {
                const [a, b, c] = condition;
                if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                    cells[a].classList.add('winner');
                    cells[b].classList.add('winner');
                    cells[c].classList.add('winner');
                }
            }
            return;
        }

        if (winner === 'tie') {
            gameActive = false;
            statusMessage.textContent = "Game ended in a draw!";
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerDisplay.textContent = currentPlayer === 'X' ? 'Your' : "Computer's";
    }

    function resetGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        statusMessage.textContent = '';
        currentPlayerDisplay.textContent = 'Your';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });

        // Add reset animation
        gameBoard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            gameBoard.style.transform = 'scale(1)';
        }, 150);
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetGame);
}); 