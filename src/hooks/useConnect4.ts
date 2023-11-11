import { useState } from "react";

type Board = Array<Array<Counter | null>>;
type Counter = 0 | 1;

interface UseConnect4Props {
  numberOfColumns?: number;
  numberOfRows?: number;
  numberToWin?: number;
}

interface Connect4 {
  board: Board;
  player: Counter;
  winner: Counter | null;
  error: string | null;
  dropCounter: (column: number) => void;
  reset: () => void;
}

const DEFAULTS = {
  numberOfColumns: 7,
  numberOfRows: 6,
  numberToWin: 4,
};

const DIRECTIONS = {
  horizontal: [1, 0],
  vertical: [0, 1],
  diagonal: [1, 1],
  antidiagonal: [1, -1],
};

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
   * The board is represented as a 2D array of nulls.
   * The first dimension represents the columns, and the second dimension
   * represents the rows.
   * The bottom left cell is [0, 0].
   *
   * @returns A new board.
   */
  function createBoard(): Board {
    const board = [];
    for (let i = 0; i < numberOfColumns; i++) {
      board.push(new Array(numberOfRows).fill(null));
    }
    return board;
  }

  const [board, setBoard] = useState<Board>(createBoard());
  const [player, setPlayer] = useState<Counter>(0);
  const [winner, setWinner] = useState<Counter | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Drops the next player's counter into the specified column.
   *
   * @param column The column to drop the counter into.
   */
  function dropCounter(column: number) {
    if (column < 0 || column >= numberOfColumns) {
      setError(`Column ${column} does not exist`);
      return;
    }
    if (board[column][numberOfRows - 1] !== null) {
      setError(`Column ${column} is full`);
      return;
    }

    const newBoard = [...board];
    let row;
    for (let i = 0; i < numberOfRows; i++) {
      row = i;
      if (newBoard[column][row] === null) {
        newBoard[column][row] = player;
        break;
      }
    }

    if (row && isWinning(column, row)) {
      setWinner(player);
    }
    setBoard(newBoard);
    setPlayer((p) => (p === 0 ? 1 : 0));
    setError(null);
  }

  /**
   * Checks a position on the board for a win.
   *
   * @param row The row of the position to check.
   * @param col The column of the position to check.
   * @returns Whether the position is part of a winning line.
   */
  function isWinning(col: number, row: number) {
    for (const [deltaCol, deltaRow] of Object.values(DIRECTIONS)) {
      let count = 0;
      for (let t = -numberToWin + 1; t < numberToWin; t++) {
        const i = col + t * deltaCol;
        const j = row + t * deltaRow;
        if (i < 0 || i >= numberOfColumns || j < 0 || j >= numberOfRows) {
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
   * Resets the game to its initial state.
   */
  function reset() {
    setBoard(createBoard());
    setPlayer(0);
    setWinner(null);
    setError(null);
  }

  return {
    board,
    player,
    winner,
    error,
    dropCounter,
    reset,
  };
}

export type { Counter, Board, Connect4 };
export { DEFAULTS };
export default useConnect4;
