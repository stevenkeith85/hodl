import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'
import { PusherContext } from '../contexts/PusherContext';
import { messageToSign } from '../lib/messageToSign';
import { getMetaMaskSigner } from '../lib/connections';


export const useConnect = () => {
  const { pusher, setPusher, setUserSignedInToPusher } = useContext(PusherContext);
  const { setSigner, setAddress } = useContext(WalletContext);

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (returningUser = true): Promise<Boolean> => {
    try {
      const signer = await getMetaMaskSigner(returningUser);
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
        }
      }

      setSigner(signer);
      setAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Sometimes we only need to disconnect the FE, as the BE has already been disconnected
  const disconnectFE = () => {
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

  return [connect, disconnect, disconnectFE];
}