import useConnect4Context from "@/hooks/useConnect4Context";
import "./Message.css";

function Message() {
  const { winner, error } = useConnect4Context();

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
