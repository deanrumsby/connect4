import { test, expect } from "vitest";
import { renderHook } from "@testing-library/react";

import useConnect4 from "./useConnect4";

/**
 * @vitest-environment jsdom
 */

test("player should change after each counter added", () => {
  const { result, rerender } = renderHook(() => useConnect4());

  for (let i = 0; i < 5; i++) {
    const { nextPlayer, dropCounter } = result.current;

    expect(nextPlayer).toBe(i % 2);
    dropCounter(0);
    rerender();
  }
});

test("counters stack as expected", () => {
  const { result, rerender } = renderHook(() => useConnect4());

  const turns = [0, 0, 1, 1, 1, 0, 4, 2];
  turns.forEach((turn) => {
    const { dropCounter } = result.current;

    dropCounter(turn);
    rerender();
  });

  const { stringifyBoard } = result.current;

  expect(stringifyBoard()).toEqual(
    "xxxxxxx\n" +
      "xxxxxxx\n" +
      "xxxxxxx\n" +
      "10xxxxx\n" +
      "11xxxxx\n" +
      "001x0xx",
  );
});
