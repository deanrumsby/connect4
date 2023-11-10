import type { Counter } from "@/hooks/useConnect4";

const counterColors: {
  [K in Counter]: string;
} = {
  0: "red",
  1: "yellow",
};

export { counterColors };
