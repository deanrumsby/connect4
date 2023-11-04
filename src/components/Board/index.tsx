import type { Counter } from "@/hooks/useConnect4";
import Column from "./Column";
import "./Board.css";

interface BoardProps {
  board: (Counter | null)[][];
}

function Board({ board }: BoardProps) {
  const numberOfColumns = board.length;
  const numberOfRows = board[0].length;

  return (
    <div
      className="board"
      style={{ aspectRatio: numberOfColumns / numberOfRows }}
    >
      {board.map((counters: (Counter | null)[]) => (
        <Column counters={counters} />
      ))}
    </div>
  );
}

export default Board;
