import "./App.css";
import { Connect4Provider } from "./context/Connect4Context";
import Board from "./components/Board";
import Message from "./components/Message";

function App() {
  return (
    <Connect4Provider>
      <div className="main-container">
        <div className="board-container">
          <Board />
        </div>
        <div className="message-container">
          <Message />
        </div>
      </div>
    </Connect4Provider>
  );
}

export default App;
