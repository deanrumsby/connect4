import { useState } from "react";

type Board = Array<Array<Counter | null>>;
type Counter = 0 | 1;

interface BoardState {
  board: Board;
  nextAvailableRows: Array<number | null>;
  lastMove: [number, number] | null;
}

interface Connect4 {
  boardState: BoardState;
  nextAvailableRows: Array<number | null>;
  nextPlayer: Counter;
  winner: Counter | null;
  dropCounter: (column: number) => void;
  reset: () => void;
  stringifyBoard: () => string;
}

const NUM_ROWS = 6;
const NUM_COLS = 7;
const NUM_TO_WIN = 4;

const DIRECTIONS = {
  horizontal: [0, 1],
  vertical: [1, 0],
  diagonal: [1, 1],
  antidiagonal: [-1, 1],
};

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

/**
 * A hook for playing Connect 4.
 *
 * @returns An object containing the current state of the game and
 * functions for interacting with it.
 */
function useConnect4(): Connect4 {
  /**
   * Creates a new board.
   *
   * @returns A new board.
   */
  function createBoard(): Board {
    const board = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      board.push(new Array(NUM_COLS).fill(null));
    }
    return board;
  }

  const initialBoardState: BoardState = {
    board: createBoard(),
    nextAvailableRows: new Array(NUM_COLS).fill(NUM_ROWS - 1),
    lastMove: null,
  };

  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const { board, nextAvailableRows, lastMove } = boardState;

  /**
   * Drops the next player's counter into the specified column.
   *
   * @param column The column to drop the counter into.
   * @throws {NonExistentColumnError} If the column does not exist.
   * @throws {ColumnFullError} If the column is full.
   */
  function dropCounter(column: number) {
    const { board, nextAvailableRows } = boardState;

    if (column < 0 || column >= NUM_COLS) {
      throw new NonExistentColumnError(column);
    }
    if (nextAvailableRows[column] === null) {
      throw new ColumnFullError(column);
    }

    const newBoard = [...board];
    const row = nextAvailableRows[column] as number;
    newBoard[row][column] = nextPlayer();
    const newNextAvailableRows = [...nextAvailableRows];
    newNextAvailableRows[column] = row === 0 ? null : row - 1;

    setBoardState({
      board: newBoard,
      nextAvailableRows: newNextAvailableRows,
      lastMove: [row, column],
    });
  }

  /**
   * Checks a position on the board for a win.
   *
   * @param row The row of the position to check.
   * @param col The column of the position to check.
   * @returns Whether the position is part of a winning line.
   */
  function checkWin(row: number, col: number) {
    const player = board[row]?.[col];

    if (player === null || player === undefined) {
      return false;
    }

    for (const [deltaRow, deltaCol] of Object.values(DIRECTIONS)) {
      let count = 0;
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
    }
    return false;
  }

  /**
   * Returns the next player to play.
   *
   * @returns The next player to play.
   */
  function nextPlayer(): Counter {
    if (lastMove === null) {
      return 0;
    }
    const [row, col] = lastMove;
    return board[row][col] === 0 ? 1 : 0;
  }

  /**
   * Returns the winning player, or null if there is no winner.
   *
   * @returns The winning player, or null if there is no winner.
   */
  function winningPlayer(): Counter | null {
    if (lastMove === null) {
      return null;
    }
    const [row, col] = lastMove;
    const player = board[row][col];
    return checkWin(row, col) ? player : null;
  }

  /**
   * Resets the game to its initial state.
   */
  function reset() {
    setBoardState(initialBoardState);
  }

  /**
   * Returns a string representation of the board.
   *
   * @returns A string representation of the board.
   */
  function stringifyBoard() {
    return board
      .map((row) => row.map((cell) => (cell === null ? "x" : cell)).join(""))
      .join("\n");
  }

  return {
    boardState,
    nextAvailableRows,
    nextPlayer: nextPlayer(),
    winner: winningPlayer(),
    dropCounter,
    reset,
    stringifyBoard,
  };
}

export type { Counter };
export default useConnect4;
