import "./App.css";
import { Connect4Provider } from "./context/Connect4Context";
import Board from "./components/Board";

function App() {
  return (
    <Connect4Provider>
      <div className="board-container">
        <Board />;
      </div>
    </Connect4Provider>
  );
}

export default App;
