import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";

type Board = Array<Array<Counter | null>>;
type Counter = 0 | 1;

interface Connect4ProviderProps {
  children: ReactNode;
}

interface Connect4 {
  numberToWin: number;
  board: Board;
  player: Counter;
  winner: Counter | null;
  winLine: number[][] | null;
  error: string | null;
}

type DropCounterAction = {
  type: "DROP_COUNTER";
  payload: {
    column: number;
  };
};

type Connect4Action = DropCounterAction;

const DIRECTIONS = {
  horizontal: [1, 0],
  vertical: [0, 1],
  diagonal: [1, 1],
  antidiagonal: [1, -1],
};

const DEFAULTS = {
  numberOfColumns: 7,
  numberOfRows: 6,
  numberToWin: 4,
};

const initialState: Connect4 = {
  numberToWin: DEFAULTS.numberToWin,
  board: createBoard(DEFAULTS.numberOfColumns, DEFAULTS.numberOfRows),
  player: 0,
  winner: null,
  winLine: null,
  error: null,
};

const Connect4Context = createContext<Connect4 | null>(null);
const Connect4DispatchContext = createContext<Dispatch<Connect4Action> | null>(
  null,
);

function Connect4Provider({ children }: Connect4ProviderProps) {
  const [connect4, dispatch] = useReducer(connect4Reducer, initialState);
  return (
    <Connect4Context.Provider value={connect4}>
      <Connect4DispatchContext.Provider value={dispatch}>
        {children}
      </Connect4DispatchContext.Provider>
    </Connect4Context.Provider>
  );
}

function useConnect4(): [Connect4, Dispatch<Connect4Action>] {
  const connect4 = useContext(Connect4Context);
  const dispatch = useContext(Connect4DispatchContext);
  if (connect4 === null || dispatch === null) {
    throw new Error("useConnect4 must be used within a Connect4Provider");
  }
  return [connect4, dispatch];
}

const connect4Reducer = (state: Connect4, action: Connect4Action): Connect4 => {
  const { board, player, numberToWin, winner } = state;
  switch (action.type) {
    case "DROP_COUNTER": {
      const { column } = action.payload;
      if (winner !== null) {
        return state;
      }
      if (column < 0 || column >= board.length) {
        return { ...state, error: "Column does not exist" };
      }
      const lastRow = board[column].length - 1;
      if (board[column][lastRow] !== null) {
        return { ...state, error: "Column is full" };
      }
      const newBoard = [...board];
      newBoard[column] = [...newBoard[column]];

      const row = newBoard[column].findIndex((counter) => counter === null);
      newBoard[column][row] = player;
      const newWinLine = findWinLine(newBoard, column, row, numberToWin);
      if (newWinLine !== null) {
        return {
          ...state,
          board: newBoard,
          winner: player,
          winLine: newWinLine,
          error: null,
        };
      }
      const nextPlayer = player === 0 ? 1 : 0;
      return { ...state, board: newBoard, player: nextPlayer, error: null };
    }
    default:
      return state;
  }
};

/**
 * Creates a new board.
 * The board is represented as a 2D array of nulls.
 * The first dimension represents the columns, and the second dimension
 * represents the rows.
 * The bottom left cell is [0, 0].
 *
 * @param numberOfColumns The number of columns in the board.
 * @param numberOfRows The number of rows in the board.
 * @returns A new board.
 */
function createBoard(numberOfColumns: number, numberOfRows: number): Board {
  const board = [];
  for (let i = 0; i < numberOfColumns; i++) {
    board.push(new Array(numberOfRows).fill(null));
  }
  return board;
}

/**
 * Checks a position on the board for a winning line.
 *
 * @param row The row of the position to check.
 * @param col The column of the position to check.
 * @returns The coordinates of a winning line
 */
function findWinLine(
  board: Board,
  col: number,
  row: number,
  numberToWin: number,
) {
  for (const [deltaCol, deltaRow] of Object.values(DIRECTIONS)) {
    const player = board[col][row];
    const numberOfColumns = board.length;
    const numberOfRows = board[0].length;
    let winLine = [];
    for (let t = -numberToWin + 1; t < numberToWin; t++) {
      const i = col + t * deltaCol;
      const j = row + t * deltaRow;
      if (i < 0 || i >= numberOfColumns || j < 0 || j >= numberOfRows) {
        continue;
      }
      if (board[i][j] === player) {
        winLine.push([i, j]);
        if (winLine.length === numberToWin) {
          return winLine;
        }
      } else {
        winLine = [];
      }
    }
  }
  return null;
}

export default Connect4Provider;
export { useConnect4, type Counter };
