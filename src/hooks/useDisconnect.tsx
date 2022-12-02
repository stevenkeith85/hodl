import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';

import axios from 'axios'


export const useDisconnect = () => {
  const { 
    setSigner, 
    setProvider, 
    setAddress, 
    provider, 
  } = useContext(WalletContext);

  const disconnectFE = async () => {
    try {
    provider?.provider?.disconnect()
    } catch(e) {
      // some providers don't support this
      console.log("provider doesn't support disconnect");
    }
    
    localStorage.removeItem("walletconnect");
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");

    setProvider(null);
    setSigner(null);
    setAddress(null);
  }

  const disconnectBE = async () => {
    try {
      const r = await axios.post(
        '/api/auth/logout',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      )
      return true;
    } catch (error) {
      console.log("Unable to log out of the BE");
      console.log(error);

      // TODO: If we don't manage to log the user out for whatever reason, we could perhaps clear their cookies on the FE?
      return false;
    }
  }

  // TODO: Perhaps we can do this async?
  const disconnect = async () => {
    await disconnectFE();
    await disconnectBE();
  }

  return disconnect;
}