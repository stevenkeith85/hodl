import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'
import { PusherContext } from '../contexts/PusherContext';
import { messageToSign } from '../lib/messageToSign';
import { getSigner } from '../lib/connections';

import { disconnect as _disconnect } from '@wagmi/core'

export const useConnect = () => {
  const { pusher, setPusher, setUserSignedInToPusher } = useContext(PusherContext);
  const { setSigner, setAddress } = useContext(WalletContext);

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (returningUser = true): Promise<Boolean> => {
    try {
      // debugger;
      const signer = await getSigner();

      if (!signer) {
        return false;
      }

      const address = await signer.getAddress();

      if (!returningUser) {
        const { uuid } = await axios.get(`/api/auth/uuid?address=${address}`).then(r => r.data);

        const signature = await signer.signMessage(messageToSign + uuid);

        try {
          const r = await axios.post(
            '/api/auth/login',
            {
              signature,
              address
            },
            {
              headers: {
                'Accept': 'application/json'
              },
            }
          );

        } catch (error) {
          console.log(error)
          return false;
        }
      }

      setSigner(signer);
      setAddress(address);

      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  const disconnectFE = async () => {

    // MetaMask doesn't actually allow us to programatically disconnect. 
    // WalletConnect does though; so its worth doing. MM might support this in the future.
    await _disconnect();

    setSigner(null);

    // We set the address with what's set in the backend; so don't use wagmi here
    setAddress(null);

    pusher?.disconnect();
    setUserSignedInToPusher(null);
    setPusher(null);
  }


  const disconnect = async () => {

    await disconnectFE();

    try {
      const r = await axios.post(
        '/api/auth/logout',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      )
    } catch (error) {
    }
  }

  return [connect, disconnect];
}