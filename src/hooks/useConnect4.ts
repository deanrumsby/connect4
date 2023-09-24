import { useState } from "react";

type Board = Array<Array<Counter | null>>;
type Counter = "red" | "yellow";
type WinDirection = "horizontal" | "vertical" | "diagonal" | "antidiagonal";

const NUM_ROWS = 6;
const NUM_COLS = 7;
const NUM_TO_WIN = 4;

class NonExistentColumnError extends Error {
  constructor(column: number) {
    super(`Column ${column} does not exist`);
  }
}

class ColumnFullError extends Error {
  constructor(column: number) {
    super(`Column ${column} is full`);
  }
}

function useConnect4() {
  const [player, setPlayer] = useState<Counter>("red");
  const [winner, setWinner] = useState<Counter | null>(null);

  // Create a 2D array of size NUM_ROWS x NUM_COLS
  // and initialize it with null values
  function createBoard(): Board {
    const board = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      board.push(new Array(NUM_COLS).fill(null));
    }
    return board;
  }

  const [board, setBoard] = useState<Board>(createBoard());

  // Drop a counter into the board
  // The counter should fall to the lowest available row
  // in the given column
  function _dropCounter(column: number) {
    if (column < 0 || column >= NUM_COLS) {
      throw new NonExistentColumnError(column);
    }
    if (board[0][column] !== null) {
      throw new ColumnFullError(column);
    }
    const newBoard = [...board];
    let row;
    for (let i = NUM_ROWS - 1; i >= 0; i--) {
      if (newBoard[i][column] === null) {
        newBoard[i][column] = player;
        row = i;
        break;
      }
    }
    setBoard(newBoard);
    return row as number;
  }

  // Check if there is a win at the given position
  function checkWin(row: number, col: number) {
    const player = board[row]?.[col];

    if (player === null || player === undefined) {
      return false;
    }

    // Check a given direction for a win
    function check(direction: WinDirection) {
      let count = 0;
      let deltaRow;
      let deltaCol;
      switch (direction) {
        case "horizontal":
          deltaRow = 0;
          deltaCol = 1;
          break;
        case "vertical":
          deltaRow = 1;
          deltaCol = 0;
          break;
        case "diagonal": {
          deltaRow = 1;
          deltaCol = 1;
          break;
        }
        case "antidiagonal": {
          deltaRow = -1;
          deltaCol = 1;
          break;
        }
      }
      for (let t = -NUM_TO_WIN; t < NUM_TO_WIN; t++) {
        const i = row + t * deltaRow;
        const j = col + t * deltaCol;
        if (i < 0 || i >= NUM_ROWS || j < 0 || j >= NUM_COLS) {
          continue;
        }
        if (board[i][j] === player) {
          count++;
          if (count === NUM_TO_WIN) {
            return true;
          }
        } else {
          count = 0;
        }
      }
      return false;
    }

    for (const direction of [
      "horizontal",
      "vertical",
      "diagonal",
      "antidiagonal",
    ]) {
      if (check(direction as WinDirection)) {
        return true;
      }
    }
  }

  // Drop a counter into the board and check for a win
  function dropCounter(column: number) {
    const row = _dropCounter(column);
    if (checkWin(row, column)) {
      setWinner(player);
    } else {
      setPlayer(player === "red" ? "yellow" : "red");
    }
  }

  // Reset the board to its initial state
  function reset() {
    setBoard(createBoard());
  }

  return { board, player, winner, dropCounter, reset };
}

export default useConnect4;
