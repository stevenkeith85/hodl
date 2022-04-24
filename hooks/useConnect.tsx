import { useContext } from 'react';
import { messageToSign } from "../lib/utils";
import { getMetaMaskSigner } from '../lib/connections';
import { WalletContext } from "../pages/_app";

export const useConnect = () => {

  const { setSigner, setAddress } = useContext(WalletContext);

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (returningUser=true, jwtExpired=false) => {
    try {
      const _signer = await getMetaMaskSigner(returningUser);
      const _address = await _signer.getAddress();

      if (!returningUser || jwtExpired) {
        // get nonce
        const rNonce = await fetch(`/api/auth/nonce?address=${_address}`);
        const { nonce } = await rNonce.json();

        // get user to sign message + nonce
        const signature = await _signer.signMessage(messageToSign + nonce);

        // send the sign to the BE
        const rSig = await fetch('/api/auth/signature', {
          credentials: 'include',
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
          body: JSON.stringify({
            signature,
            address: _address
          })
        });

        const { token } = await rSig.json();
        localStorage.setItem('jwt', token);
      }

      setSigner(_signer);
      setAddress(_address);
    } catch (e) {
      console.log(e)
    }
  }

  const disconnect = async () => {
    setSigner(null);
    setAddress(null);
    localStorage.setItem('jwt', '');
  }

  return [connect, disconnect];
}