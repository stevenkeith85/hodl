import Pusher from "pusher-js";
import { createContext } from "react";

export const PusherContext = createContext<{
    pusher: Pusher,
    setPusher: Function,
    userSignedInToPusher: boolean, 
    setUserSignedInToPusher: Function
  }>(null);
  