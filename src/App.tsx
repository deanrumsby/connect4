import { useEffect } from "react";

import "./App.css";
import useConnect4 from "./hooks/useConnect4";
import Board from "./components/Board";

function App() {
  const {
    boardState: { board },
  } = useConnect4();

  useEffect(() => {
    console.log(board);
  }, [board]);

  return <Board board={board} />;
}

export default App;
