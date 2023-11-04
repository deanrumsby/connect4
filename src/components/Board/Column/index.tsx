import type { Counter } from "@/hooks/useConnect4";
import Cell from "./Cell";
import "./Column.css";

interface ColumnProps {
  counters: (Counter | null)[];
  addCounter: () => void;
}

function Column({ counters, addCounter }: ColumnProps) {
  return (
    <div className="column" onClick={addCounter}>
      {counters.map((counter: Counter | null) => (
        <Cell counter={counter} />
      ))}
    </div>
  );
}

export default Column;
