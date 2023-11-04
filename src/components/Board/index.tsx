import type { Counter } from "@/hooks/useConnect4";
import Column from "./Column";
import "./Board.css";

interface BoardProps {
  board: (Counter | null)[][];
}

function Board({ board }: BoardProps) {
  return (
    <div className="board">
      {board.map((counters: (Counter | null)[]) => (
        <Column counters={counters} />
      ))}
    </div>
  );
}

export default Board;
