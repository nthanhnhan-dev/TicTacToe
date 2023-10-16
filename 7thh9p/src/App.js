import { cloneElement, useState } from 'react';

function Square({ value, onSquareClick, squareStyle, location }) {
  return (
    <button
      className="square"
      style={squareStyle}
      onClick={onSquareClick}
      location = {location}
    >
      {value}
    </button>
  );
}

function getLocation(i) {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return `(${row}, ${col})`;
}

function Board({ xIsNext, squares, onPlay }) {
  const { winner, line } = calculateWinner(squares);

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const isDraw = squares.every((square) => square !== null);

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function renderSquare(i) {
    const isWinningSquare = line && line.includes(i);

    const squareStyle = isWinningSquare ? { background: 'yellow' } : {};
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        squareStyle={squareStyle}
        location={getLocation(i)}
      />
    );
  }

  function renderBoardRow(row) {
    const rowSquares = [];
    for (let i = 0; i < 3; i++) {
      rowSquares.push(renderSquare(row * 3 + i));
    }
    return (
      <div className="board-row" key={row}>
        {rowSquares}
      </div>
    );
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    boardRows.push(renderBoardRow(row));
  }

  return (
    <div>
      <div className="status">{status}</div>
      {boardRows}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setSortAscending(!sortAscending);
  }

  const sortedHistory = sortAscending ? [...history] : [...history].reverse();

  const moves = sortedHistory.map((squares, move) => {
    const step = sortAscending ? move : sortedHistory.length - 1 - move;
    const location = step === 0 ? '' : getLocation(squares.indexOf(null));

    let description;
    if (step > 0) {
      description = `Go to move # ${step} ${location}`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={step}>
        {step === currentMove ? (
          <div>You are at move # {step}</div>
        ) : (
          <button onClick={() => jumpTo(step)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleSortOrder}>
            Toggle Sort Order ({sortAscending ? 'Ascending' : 'Descending'})
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}
