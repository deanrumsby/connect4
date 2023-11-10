import type { Counter, Board } from "@/hooks/useConnect4";
import useConnect4Context from "@/hooks/useConnect4Context";
import Column from "./Column";
import "./Board.css";

function Board() {
  const { board } = useConnect4Context();
  const numberOfColumns = board[0].length;
  const numberOfRows = board.length;

  return (
    <div
      className="board"
      style={{ aspectRatio: numberOfRows / numberOfColumns }}
    >
      {board.map((counters: (Counter | null)[], columnIndex) => (
        <Column
          key={columnIndex}
          columnIndex={columnIndex}
          counters={counters}
        />
      ))}
    </div>
  );
}

export default Board;
