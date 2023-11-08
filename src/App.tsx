import "./App.css";
import useConnect4 from "./hooks/useConnect4";
import Board from "./components/Board";

function App() {
  const { board, dropCounter } = useConnect4();

  return (
    <div className="board-container">
      <Board board={board} dropCounter={dropCounter} />;
    </div>
  );
}

export default App;
