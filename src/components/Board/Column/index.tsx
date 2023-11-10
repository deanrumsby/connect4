import { useState } from "react";

import type { Counter } from "@/hooks/useConnect4";
import useConnect4Context from "@/hooks/useConnect4Context";
import { counterColors } from "@/constants";
import Cell from "./Cell";
import "./Column.css";

interface ColumnProps {
  columnIndex: number;
  counters: (Counter | null)[];
}

function Column({ columnIndex, counters }: ColumnProps) {
  const { player, dropCounter } = useConnect4Context();

  const [shouldHighlightNextCell, setShouldHighlightNextCell] =
    useState<boolean>(false);

  const nextCellIndex = counters.findIndex((counter) => counter === null);
  const nextCellHighlighting = {
    color: counterColors[player],
  };

  const handleOnMouseEnter = () => {
    setShouldHighlightNextCell(true);
  };

  const handleOnMouseLeave = () => {
    setShouldHighlightNextCell(false);
  };

  const renderCell = (counter: Counter | null, rowIndex: number) => {
    const highlighting =
      rowIndex === nextCellIndex && shouldHighlightNextCell
        ? nextCellHighlighting
        : undefined;
    return (
      <Cell key={rowIndex} counter={counter} highlighting={highlighting} />
    );
  };

  return (
    <div
      className="column"
      onClick={() => dropCounter(columnIndex)}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {counters.map(renderCell)}
    </div>
  );
}

export default Column;
