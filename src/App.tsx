import { useEffect } from "react";

import "./App.css";
import useConnect4 from "./hooks/useConnect4";
import Board from "./components/Board";

function App() {
  const {
    boardState: { board },
    dropCounter,
  } = useConnect4();

  useEffect(() => {
    console.log(board);
  }, [board]);

  return (
    <div className="board-container">
      <Board board={board} dropCounter={dropCounter} />;
    </div>
  );
}

export default App;
