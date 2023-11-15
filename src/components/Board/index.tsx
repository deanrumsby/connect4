import { useConnect4, type Counter } from "@/context/Connect4Context";
import Column from "./Column";
import "./Board.css";

function Board() {
  const [connect4] = useConnect4();
  const { board } = connect4;

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
