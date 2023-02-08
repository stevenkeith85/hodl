import { Biconomy } from "@biconomy/mexa";
import { createContext } from "react";

export const BiconomyContext = createContext<{
    biconomy: Biconomy,
    setBiconomy: Function
  }>(null);
  