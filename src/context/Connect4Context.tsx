import { createContext, type ReactNode } from "react";

import useConnect4, { type Connect4 } from "../hooks/useConnect4";

interface Connect4ProviderProps {
  children: ReactNode;
}

const Connect4Context = createContext<Connect4 | null>(null);

function Connect4Provider({ children }: Connect4ProviderProps) {
  const connect4 = useConnect4();
  return (
    <Connect4Context.Provider value={connect4}>
      {children}
    </Connect4Context.Provider>
  );
}

export default Connect4Context;
export { Connect4Provider };
