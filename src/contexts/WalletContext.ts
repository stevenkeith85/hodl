import { createContext } from "react";

export const WalletContext = createContext<{
    signer: any,
    setSigner: Function,
    address: any,
    setAddress: Function,
  }>({
    signer: null,
    setSigner: () => {},
    address: null,
    setAddress: () => {}
  });
  