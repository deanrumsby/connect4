import type { Counter } from "@/hooks/useConnect4";
import Column from "./Column";
import "./Board.css";

interface BoardProps {
  board: (Counter | null)[][];
  dropCounter: (columnIndex: number) => void;
}

function Board({ board, dropCounter }: BoardProps) {
  const numberOfColumns = board[0].length;
  const numberOfRows = board.length;

  return (
    <div
      className="board"
      style={{ aspectRatio: numberOfRows / numberOfColumns }}
    >
      {board.map((counters: (Counter | null)[], columnIndex) => (
        <Column
          counters={counters}
          addCounter={() => dropCounter(columnIndex)}
        />
      ))}
    </div>
  );
}

export default Board;
