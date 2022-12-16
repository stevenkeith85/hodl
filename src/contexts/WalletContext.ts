import { createContext } from "react";

export const WalletContext = createContext<{
  provider: any,
  setProvider: Function,

  signer: any,
  setSigner: Function,

  walletAddress: any,
  setWalletAddress: Function,
}>({
  provider: null,
  setProvider: () => { },

  signer: null,
  setSigner: () => { },

  walletAddress: null,
  setWalletAddress: () => { }
});
