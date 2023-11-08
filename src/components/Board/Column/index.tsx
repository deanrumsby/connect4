import type { Counter } from "@/hooks/useConnect4";
import Cell from "./Cell";
import "./Column.css";

interface ColumnProps {
  counters: (Counter | null)[];
  onClick: () => void;
}

function Column({ counters, onClick }: ColumnProps) {
  return (
    <div className="column" onClick={onClick}>
      {counters.map((counter: Counter | null) => (
        <Cell counter={counter} />
      ))}
    </div>
  );
}

export default Column;
