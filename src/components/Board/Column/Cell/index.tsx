import type { Counter } from "@/hooks/useConnect4";
import "./Cell.css";

interface CellProps {
  counter: Counter | null;
}

const counterColors: {
  [K in Counter]: string;
} = {
  0: "red",
  1: "yellow",
};

function Cell({ counter }: CellProps) {
  const counterColor = counter !== null ? counterColors[counter] : "white";
  const counterStyles = {
    backgroundColor: counterColor,
  };

  return (
    <div className="cell">
      <div className="counter" style={counterStyles}>
        &nbsp;
      </div>
    </div>
  );
}

export default Cell;
