import type { Counter } from "@/hooks/useConnect4";
import Cell from "./Cell";
import "./Column.css";

interface ColumnProps {
  counters: (Counter | null)[];
}

function Column({ counters }: ColumnProps) {
  return (
    <div className="column">
      {counters.map((counter: Counter | null) => (
        <Cell counter={counter} />
      ))}
    </div>
  );
}

export default Column;
