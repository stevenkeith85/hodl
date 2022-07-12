import { useContext } from 'react';
import { messageToSign } from "../lib/utils";
import { getMetaMaskSigner } from '../lib/connections';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'

export const useConnect = () => {

  const { setSigner, setAddress } = useContext(WalletContext);

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (returningUser = true, jwtExpired = false): Promise<Boolean> => {
    try {
      const _signer = await getMetaMaskSigner(returningUser);
      const _address = await _signer.getAddress();

      if (!returningUser || jwtExpired) {
        // get nonce
        const rNonce = await axios.get(`/api/auth/nonce?address=${_address}`);
        const { nonce } = await rNonce.data;

        // get user to sign message + nonce
        const signature = await _signer.signMessage(messageToSign + nonce);

        try {
          const r = await axios.post(
            '/api/auth/signature',
            {
              signature,
              address: _address
            },
            {
              headers: {
                'Accept': 'application/json'
              },
            }
          );

          const { token } = await r.data;
          localStorage.setItem('jwt', token);
        } catch (error) {
        }
      }

      setSigner(_signer);
      setAddress(_address);
      return true;
    } catch (e) {
      return false;
    }
  }

  const disconnect = async () => {
    setSigner(null);
    setAddress(null);
    localStorage.removeItem('jwt');

    try {
      const r = await axios.post(
        '/api/auth/logout',
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
          },
        }
      )
    } catch (error) {
    }
  }

  return [connect, disconnect];
}