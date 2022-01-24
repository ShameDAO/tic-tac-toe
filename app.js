const dimension = 3;
const squares = dimension ** 2;

const gameBoard = (() => {
    "use strict";

    const dimension = 3
    const squares = dimension ** 2
    const gameArea = document.querySelector(".game-board");
    const playerTurnText = document.querySelector(".player-turn");


    const _createSquare = () => {
        const square = document.createElement("button");
        square.classList.add("board-square");
        square.onclick = addMark;
        gameArea.appendChild(square);
        return square;
    };

    const addMark = e => {
        const square = e.target;
        const squarePos = _boardDisplay.indexOf(square);

        let winner;

        switch (_playerTurn) {
            case (1):
                square.textContent = "X";
                _boardMarks[squarePos] = "X";
                winner = gameController.checkWin();
                if (winner || !hasEmptySquares(_boardMarks)) endGame(winner);
                else playerTurnText.textContent = "It is Player 2's turn. (O)";
                _playerTurn = 2;
                break;
            case (2):
                square.textContent = "O";
                _boardMarks[squarePos] = "O";
                winner = gameController.checkWin();
                if (winner || !hasEmptySquares(_boardMarks)) endGame(winner);
                else playerTurnText.textContent = "It is Player 1's turn. (X)";
                _playerTurn = 1;
                break;
            default:
                throw "It is either Player 1 or 2's turn!";
        }

        square.disabled = true;
    };

    const getBoard = () => {
        return _boardMarks;
    };

    const freezeBoard = () => {
        _boardDisplay.forEach(square => square.disabled = true)
    };

    const createReplayBtn = () => {
        let replayBtn = document.createElement("button");
        replayBtn.classList.add("replay-btn");
        replayBtn.textContent = "Play again";
        replayBtn.addEventListener("click", restartGame);
        playerTurnText.after(replayBtn);

        return replayBtn;
    }

    const endGame = winner => {
        freezeBoard();
        if (winner) playerTurnText.textContent = `Player ${winner} won!`;
        else playerTurnText.textContent = "It was a tie!";
        replayBtn.style.display = "inline";
    }

    const restartGame = () => {
        _playerTurn = 1
        _boardDisplay.forEach(square => {
            square.disabled = false;
            square.textContent = "";
        });
        _boardMarks = new Array(squares);

        playerTurnText.textContent = "It is Player 1's turn. (X)";
        replayBtn.style.display = "none";

    }

    const hasEmptySquares = boardMarks => {
        return (boardMarks.includes(undefined));
    }

    const replayBtn = createReplayBtn();

    let _playerTurn = 1
    let _boardDisplay = new Array(squares).fill().map(_createSquare);
    let _boardMarks = new Array(squares);
    return {_boardDisplay, freezeBoard, getBoard};
})();

const gameController = (() => {
    const winConditions = marksStr => {
        let winner;
        switch (marksStr) {
            case "XXX":
                winner = 1;
                break;
            case "OOO":
                winner = 2;
                break;
            default:
                winner = 0;
        }
        return winner;
    };

    const checkWin = () => {
        let marksStr;
        let diagMarksArr = [];
        let revDiagMarksArr = [];
        let winner;
        const rowsMarks = [
            gameBoard.getBoard().slice(0,3),
            gameBoard.getBoard().slice(3,6),
            gameBoard.getBoard().slice(6,9)
        ];
        // check horizontal win
        for (let row of rowsMarks) {
            marksStr = row.join("");
            winner = winConditions(marksStr);
            if (winner) return winner;
        }
        // check vertical win
        for (let col = 0; col < dimension; col++) {
            const colMarks = rowsMarks.map(rowMarks => rowMarks[col]);
            marksStr = colMarks.join("");
            winner = winConditions(marksStr);
            if (winner) return winner;
        }

        // check diagonal win
        for (let i = 0; i < dimension; i++) {
            diagMarksArr.push(rowsMarks[i][i]);
            revDiagMarksArr.push(rowsMarks[dimension-1-i][i]);
        }
        // forward diagonal
        marksStr = diagMarksArr.join("");
        winner = winConditions(marksStr);
        if (winner) return winner;
        // reverse diagonal
        marksStr = revDiagMarksArr.join("");
        winner = winConditions(marksStr);
        if (winner) return winner;

        return 0;
    };

    return {checkWin};
})();