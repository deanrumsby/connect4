import { useState } from "react";

import { useConnect4, type Counter } from "@/context/Connect4Context";
import { counterColors } from "@/constants";
import Cell from "./Cell";
import "./Column.css";

interface ColumnProps {
  columnIndex: number;
  counters: (Counter | null)[];
}

function Column({ columnIndex, counters }: ColumnProps) {
  const [connect4, dispatch] = useConnect4();
  const { player, winner, winLine } = connect4;

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
        return { color: "pink", animation: "pulse" };
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
      onClick={() =>
        dispatch({ type: "DROP_COUNTER", payload: { column: columnIndex } })
      }
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {counters.map(renderCell)}
    </div>
  );
}

export default Column;
