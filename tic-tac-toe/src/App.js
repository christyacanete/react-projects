/*
TIC-TAC-TOE Game

Future improvements:
For the current move only, show “You are at move #…” instead of a button.
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
Display the location for each move in the format (row, col) in the move history list.
*/

import { useState } from 'react';

/* Blueprint of the square/tile that users can click on */
function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

/* Renders the 9 squares of the tic-tac-toe game

    Props:
        xisNext - stores the current player, X or O 
        squares - current values of each square
        onPlay - callback function; stores history and updates current move
*/

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {

        // Return right away if there's a winner or the clicked square already has a value
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // Copy the squares to a new array
        const nextSquares = squares.slice();

        // Assign value to square, depending who the current player is (X or O)
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }

        // Update the square array history and current move
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

export default function Game() {
    // Keep track of moves throughout the game
    const [history, setHistory] = useState([Array(9).fill(null)]);
    // Keeps track of the index of the current move in the history
    const [currentMove, setCurrentMove] = useState(0);
    // Determines whether the next move belongs to player X, based on whether the current move index is even or odd
    const xIsNext = currentMove % 2 === 0;
    // Represents the board's current state by accessing the board state at currentMove from the history array
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        // Append the latest board state to the previous and up to the current moves
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    // Generate a list of buttons allows the player to jump to a specific move in the game's history
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    // List of winning combinations on the board
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        // Ensure square is not empty and all three squares have the same value
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
