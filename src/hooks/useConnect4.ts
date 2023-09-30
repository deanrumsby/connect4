import { useState } from "react";

type Board = Array<Array<Counter | null>>;
type Counter = 0 | 1;

interface UseConnect4Props {
  numberOfColumns?: number;
  numberOfRows?: number;
  numberToWin?: number;
}

interface BoardState {
  board: Board;
  nextAvailableRows: Array<number | null>;
  lastMove: [number, number] | null;
}

interface Connect4 {
  boardState: BoardState;
  nextPlayer: Counter;
  winner: Counter | null;
  dropCounter: (column: number) => void;
  reset: () => void;
  stringifyBoard: () => string;
}

const DEFAULTS = {
  numberOfColumns: 7,
  numberOfRows: 6,
  numberToWin: 4,
};

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
 * @param numberOfColumns The number of columns on the board.
 * @param numberOfRows The number of rows on the board.
 * @param numberToWin The number of counters in a row required to win.
 * @returns An object containing the current state of the game and
 * functions for interacting with it.
 */
function useConnect4({
  numberOfColumns = DEFAULTS.numberOfColumns,
  numberOfRows = DEFAULTS.numberOfRows,
  numberToWin = DEFAULTS.numberToWin,
}: UseConnect4Props = {}): Connect4 {
  /**
   * Creates a new board.
   *
   * @returns A new board.
   */
  function createBoard(): Board {
    const board = [];
    for (let i = 0; i < numberOfRows; i++) {
      board.push(new Array(numberOfColumns).fill(null));
    }
    return board;
  }

  const initialBoardState: BoardState = {
    board: createBoard(),
    nextAvailableRows: new Array(numberOfColumns).fill(numberOfRows - 1),
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
    if (column < 0 || column >= numberOfColumns) {
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
      for (let t = -numberToWin + 1; t < numberToWin; t++) {
        const i = row + t * deltaRow;
        const j = col + t * deltaCol;
        if (i < 0 || i >= numberOfRows || j < 0 || j >= numberOfColumns) {
          continue;
        }
        if (board[i][j] === player) {
          count++;
          if (count === numberToWin) {
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
    nextPlayer: nextPlayer(),
    winner: winningPlayer(),
    dropCounter,
    reset,
    stringifyBoard,
  };
}

export type { Counter };
export { DEFAULTS, NonExistentColumnError, ColumnFullError };
export default useConnect4;
