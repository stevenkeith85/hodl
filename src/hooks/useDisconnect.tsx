import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';

// TODO:
// We need a hook to disconnect pusher and call it from the correct places at the correct time
// import { PusherContext } from "../../contexts/PusherContext";
// const { pusher, setPusher, setUserSignedInToPusher } = useContext(PusherContext);
// pusher?.disconnect();
// setPusher(null);
// setUserSignedInToPusher(null);

export const useDisconnect = () => {
  const {
    setSigner,
    setProvider,
    setWalletAddress,
    provider,
  } = useContext(WalletContext);

  const disconnect = async () => {
    try {
      provider?.provider?.disconnect()
    } catch (e) {
      // some providers don't support this
      console.log("provider doesn't support disconnect");
    }

    localStorage.removeItem("walletconnect");
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");

    setProvider(null);
    setSigner(null);
    setWalletAddress(null);
  }

  return disconnect;
}