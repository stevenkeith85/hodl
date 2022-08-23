import { useContext } from 'react';
import { messageToSign } from "../lib/utils";
import { getMetaMaskSigner } from '../lib/connections';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'

export const useConnect = () => {

  const { setSigner, setAddress } = useContext(WalletContext);

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (returningUser = true): Promise<Boolean> => {
    try {
      const signer = await getMetaMaskSigner(returningUser);
      const address = await signer.getAddress();

      if (!returningUser) {
        const { nonce } = await axios.get(`/api/auth/nonce?address=${address}`).then(r => r.data);

        const signature = await signer.signMessage(messageToSign + nonce);

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

  const disconnect = async () => {
    setSigner(null);
    setAddress(null);

    try {
      const r = await axios.post(
        '/api/auth/logout',
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt') // deprecated. we are switching over to all cookie solutions
          },
        }
      )
    } catch (error) {
    }
  }

  return [connect, disconnect];
}