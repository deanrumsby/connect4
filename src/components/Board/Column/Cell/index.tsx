import type { Counter } from "@/hooks/useConnect4";
import "./Cell.css";

interface CellProps {
  counter: Counter | null;
}

function Cell({ counter }: CellProps) {
  let counterClass = "counter-empty";
  if (counter) {
    counterClass = `counter-${counter}`;
  }

  return (
    <div className="cell">
      <div className={`counter ${counterClass}`}>&nbsp;</div>
    </div>
  );
}

export default Cell;
