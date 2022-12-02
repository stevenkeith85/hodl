import { createContext } from "react";

export const WalletContext = createContext<{
  provider: any,
  setProvider: Function,

  signer: any,
  setSigner: Function,

  address: any,
  setAddress: Function,
}>({
  provider: null,
  setProvider: () => { },

  signer: null,
  setSigner: () => { },

  address: null,
  setAddress: () => { }
});
