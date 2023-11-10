import type { Counter } from "@/hooks/useConnect4";
import { counterColors } from "../../../../constants";
import "./Cell.css";

interface CellProps {
  counter: Counter | null;
  highlighting?: {
    color: string;
  };
}

function Cell({ counter, highlighting }: CellProps) {
  const counterColor = counter !== null ? counterColors[counter] : "white";
  const counterStyle = {
    backgroundColor: counterColor,
  };

  let finalCounterStyle = counterStyle;
  if (highlighting) {
    const highlightStyle = {
      outlineStyle: "solid",
      outlineWidth: "5px",
      outlineColor: highlighting.color,
    };
    finalCounterStyle = { ...finalCounterStyle, ...highlightStyle };
  }

  return (
    <div className="cell">
      <div className="counter" style={finalCounterStyle}>
        &nbsp;
      </div>
    </div>
  );
}

export default Cell;
