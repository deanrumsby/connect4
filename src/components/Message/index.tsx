import { useConnect4 } from "@/context/Connect4Context";
import "./Message.css";

function Message() {
  const [connect4] = useConnect4();
  const { winner, error } = connect4;

  const determineMessage = () => {
    if (winner !== null) {
      return `Player ${winner} wins!`;
    } else if (error) {
      return error;
    } else {
      return null;
    }
  };

  return <p className="message">{determineMessage()}</p>;
}

export default Message;
