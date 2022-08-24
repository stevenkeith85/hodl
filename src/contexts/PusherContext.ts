import { createContext } from "react";

export const PusherContext = createContext<{
    pusher: any,
    setPusher: Function,
    userSignedInToPusher: boolean, 
    setUserSignedInToPusher: Function
  }>(null);
  