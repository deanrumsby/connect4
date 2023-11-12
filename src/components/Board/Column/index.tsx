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
  const { player, dropCounter, winner, winLine } = useConnect4Context();

  const [shouldHighlightNextCell, setShouldHighlightNextCell] =
    useState<boolean>(false);

  if (winner !== null && shouldHighlightNextCell) {
    setShouldHighlightNextCell(false);
  }

  const nextCellIndex = counters.findIndex((counter) => counter === null);

  const handleOnMouseEnter = () => {
    setShouldHighlightNextCell(winner === null); // Don't highlight if there's a winner
  };

  const handleOnMouseLeave = () => {
    setShouldHighlightNextCell(false);
  };

  const determineHighlighting = (rowIndex: number) => {
    if (winLine !== null) {
      if (
        winLine.find(
          ([winCol, winRow]) => winCol === columnIndex && winRow === rowIndex,
        )
      ) {
        return { color: "pink" };
      }
    }
    if (rowIndex === nextCellIndex && shouldHighlightNextCell) {
      return { color: counterColors[player] };
    }
    return undefined;
  };

  const renderCell = (counter: Counter | null, rowIndex: number) => {
    const highlighting = determineHighlighting(rowIndex);
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
