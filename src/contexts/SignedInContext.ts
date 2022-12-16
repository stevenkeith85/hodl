import { createContext } from "react";

export const SignedInContext = createContext<{
  signedInAddress: any,
  setSignedInAddress: Function,
}>({
  signedInAddress: null,
  setSignedInAddress: () => { }
});
