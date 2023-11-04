import { test, expect } from "vitest";
import { renderHook } from "@testing-library/react";

import useConnect4, { DEFAULTS } from "./useConnect4";

/**
 * @vitest-environment jsdom
 */

test("should return initial board state and values", () => {
  const { result } = renderHook(() => useConnect4());

  const { boardState, nextPlayer, winner, stringifyBoard } = result.current;
  const { nextAvailableRows, lastMove } = boardState;

  expect(stringifyBoard()).toEqual(
    "xxxxxxx\n" +
      "xxxxxxx\n" +
      "xxxxxxx\n" +
      "xxxxxxx\n" +
      "xxxxxxx\n" +
      "xxxxxxx\n",
  );
  expect(nextPlayer).toBe(0);
  expect(winner).toBe(null);
  expect(lastMove).toBe(null);
  expect(nextAvailableRows).toEqual([0, 0, 0, 0, 0, 0, 0]);
});

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

test("should throw error if column does not exist", () => {
  const { result } = renderHook(() => useConnect4());

  const { dropCounter } = result.current;
  expect(() => dropCounter(-1)).toThrow(/exist/);
  expect(() => dropCounter(7)).toThrow(/exist/);
});

test("should throw error if column is full", () => {
  const { result, rerender } = renderHook(() => useConnect4());

  for (let i = 0; i < DEFAULTS.numberOfRows; i++) {
    const { dropCounter } = result.current;

    dropCounter(0);
    rerender();
  }

  const { dropCounter } = result.current;
  expect(() => dropCounter(0)).toThrow(/full/);
});
