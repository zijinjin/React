import { useState } from "react";

function Square({ value, highlight, onSquareClick }) {
  const className = "square" + (highlight ? " highlight" : "");
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const [winner, a, b, c] = calculateWinner(squares);
  const status = winner
    ? "Game over. Winner: " + winner
    : squares.includes(null)
    ? "Next player: " + (xIsNext ? "X" : "O")
    : "Game over. It's a tie";

  const rows = [0, 1, 2].map((rowId) => {
    const cols = [0, 1, 2].map((colId) => {
      const index = rowId * 3 + colId;
      return (
        <Square
          key={index}
          value={squares[index]}
          highlight={index === a || index === b || index === c}
          onSquareClick={() => handleClick(index)}
        />
      );
    });
    return (
      <div key={rowId} className="board-row">
        {cols}
      </div>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [indices, setIndices] = useState([-1]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortOrder, setSortOrder] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, nextIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextIndices = [...indices.slice(0, currentMove + 1), nextIndex];
    setHistory(nextHistory);
    setIndices(nextIndices);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSort() {
    setSortOrder(!sortOrder);
  }

  const indicesWithMove = sortOrder
    ? indices
        .map((index, move) => [index, move])
        .slice()
        .reverse()
    : indices.map((index, move) => [index, move]);

  const moves = indicesWithMove.map((indexWithMove, i) => {
    const [index, move] = indexWithMove;
    const x = Math.floor(index / 3),
      y = index % 3;
    const description =
      move > 0
        ? move === currentMove
          ? "You are at move #" + move + " (" + x + ", " + y + ")"
          : "Go to move #" + move + " (" + x + ", " + y + ")"
        : "Go to game start";
    return (
      <li key={move}>
        {move > 0 && move === currentMove ? (
          description
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
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
        <button onClick={handleSort}>Change move order</button>
        {sortOrder ? <ol reversed>{moves}</ol> : <ol>{moves}</ol>}
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
      return [squares[a], a, b, c];
    }
  }
  return [null, null, null, null];
}
