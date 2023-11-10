import { useContext } from "react";

import Connect4Context from "../context/Connect4Context";

function useConnect4Context() {
  const context = useContext(Connect4Context);
  if (context === null) {
    throw new Error(
      "useConnect4Context must be used within a Connect4Provider",
    );
  }
  return context;
}

export default useConnect4Context;
