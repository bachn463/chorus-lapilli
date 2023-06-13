import { useState } from 'react';


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square({ value, onSquareClick, selected }) {
  return (
    <button 
    className={(selected) ? "selected-square" : "square"}
    onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, onPlay, squares }) {
  const winner = calculateWinner(squares);
  const [xs, setXs] = useState(0);
  const [os, setOs] = useState(0);
  const [movePiece, setMovePiece] = useState(false);
  const [pieceTomove, setPieceToMove] = useState(-1);
  const [selectedPiece, setSelectedPiece] = useState(Array(9).fill(false));
  const [moveStatus, setMoveStatus] = useState("");
  let status;
  const adjacency = {
    0: [1,3,4],
    1: [0,2,3,4,5],
    2: [1,4,5],
    3: [0,1,4,6,7],
    4: [0,1,2,3,5,6,7,8],
    5: [1,2,4,7,8],
    6: [3,4,7],
    7: [3,4,5,6,8],
    8: [4,5,7]
  }


  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function setSelectedSquare(index, bool) {
    const newSelected = selectedPiece.slice();
    newSelected[index] = bool;
    setSelectedPiece(newSelected);
  }

  function handleClick(i) {
    if(calculateWinner(squares)) return;
    if(squares[i] && !movePiece) return;
    if(pieceTomove == i) return;
    const nextSquares = squares.slice();

    if(movePiece) {
      if(squares[i] == "X" && xIsNext) {
        setPieceToMove(i);
        setSelectedSquare(i, true);
        setMovePiece(false);
      }
      if (squares[i] == "O" && !xIsNext) {
        setPieceToMove(i);
        setSelectedSquare(i, true);
        setMovePiece(false);
      }
      return;
    }

    if (xIsNext) {
        if(pieceTomove != -1 && !adjacency[pieceTomove].includes(i)) {
          let allAdjFull = true;
          for(let j = 0; j < adjacency[pieceTomove].length; j++) {
            if(!nextSquares[adjacency[pieceTomove][j]]) allAdjFull = false;
          }
          if(allAdjFull) {
            setMoveStatus("There are no avaiable adjacent squares");
          } else {
            setMoveStatus("You must move to an Adjacent Square");
          }
          setSelectedPiece(Array(9).fill(false));
          setPieceToMove(-1);
          setMovePiece(true);
          return;
        }
        nextSquares[i] = "X";
        setXs(xs+1);
        if(pieceTomove != -1) {
          nextSquares[pieceTomove] = null;
          if(pieceTomove != 4 && squares[4] == "X" && calculateWinner(nextSquares) != "X") {
            setMoveStatus("You must move the center X or win");
            setSelectedPiece(Array(9).fill(false));
            setPieceToMove(-1);
            setMovePiece(true);
            nextSquares[i] = null;
            nextSquares[pieceTomove] = "X";
            return;
          }
          setSelectedSquare(pieceTomove, false);
          setPieceToMove(-1);
        }
        if(os > 2) {
          setMovePiece(true);
          setMoveStatus("Click an existing O to move it");
        }
    } else {
      if(pieceTomove != -1 && !adjacency[pieceTomove].includes(i)) {
        let allAdjFull = true;
        for(let j = 0; j < adjacency[pieceTomove].length; j++) {
          if(!nextSquares[adjacency[pieceTomove][j]]) allAdjFull = false;
        }
        if(allAdjFull) {
          setMoveStatus("There are no avaiable adjacent squares");
        } else {
        setMoveStatus("You must move to an Adjacent Square");
        }
        setSelectedPiece(Array(9).fill(false));
        setPieceToMove(-1);
        setMovePiece(true);
        return;
      }
      nextSquares[i] = "O";
      setOs(os+1);
      if(pieceTomove != -1) {
        nextSquares[pieceTomove] = null;
        if(pieceTomove != 4 &&  squares[4] == "O" && calculateWinner(nextSquares) != "O") {
          setMoveStatus("You must move the center O or win");
          setSelectedPiece(Array(9).fill(false));
          setPieceToMove(-1);
          setMovePiece(true);
          nextSquares[i] = null;
          nextSquares[pieceTomove] = "O";
          return;
        }
        setSelectedSquare(pieceTomove, false);
        setPieceToMove(-1);
      }
      if(xs > 2) {
        setMovePiece(true);
        setMoveStatus("Click an existing X to move it");
      }
    }


    onPlay(nextSquares)
  }

  function handleRefresh() {
    window.location.reload();
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} selected={selectedPiece[0]} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} selected={selectedPiece[1]} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} selected={selectedPiece[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} selected={selectedPiece[3]}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} selected={selectedPiece[4]} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} selected={selectedPiece[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} selected={selectedPiece[6]} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} selected={selectedPiece[7]} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} selected={selectedPiece[8]} />
      </div>
      {(winner) ? 
      <button
      className="play-again"
      onClick={handleRefresh}
      >
        Play Again  
      </button> 
      : 
      <h3>
        {moveStatus}
      </h3>}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 == 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      {/* <div className="game-info">
        <ol>{moves}</ol>
      </div> */}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="game-page">
      <h1>
        Chorus Lapilli
      </h1>
      <div className="container">
        <Game/>
      </div>
    </div>
  );
}