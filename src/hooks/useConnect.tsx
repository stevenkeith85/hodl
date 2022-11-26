import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'
import { PusherContext } from '../contexts/PusherContext';
import { messageToSign } from '../lib/messageToSign';
import { getSigner } from '../lib/connections';

export const useConnect = () => {
  const { pusher, setPusher, setUserSignedInToPusher } = useContext(PusherContext);
  const { setSigner, setAddress } = useContext(WalletContext);

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (returningUser = true): Promise<Boolean> => {
    try {
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
    setSigner(null);
    setAddress(null);

    pusher?.disconnect();
    setUserSignedInToPusher(null);
    setPusher(null);
  }


  const disconnect = async () => {

    disconnectFE();

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