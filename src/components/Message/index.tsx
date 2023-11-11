import useConnect4Context from "@/hooks/useConnect4Context";
import "./Message.css";

function Message() {
  const { error } = useConnect4Context();
  const message = error ? error : null;
  return <div className="message">{message}</div>;
}

export default Message;
