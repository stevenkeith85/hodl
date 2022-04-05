import { useContext } from 'react';
import { messageToSign } from "../lib/utils";
import { getMetaMaskSigner } from '../lib/connections';
import { WalletContext } from "../pages/_app";

export const useConnect = () => {

  const { setSigner, setAddress, setNickname, setJwt } = useContext(WalletContext);

  const connect = async (returningUser = true) => {
    try {
      const _signer = await getMetaMaskSigner(returningUser);
      const _address = await _signer.getAddress();

      if (!returningUser) {

        // get nonce
        const rNonce = await fetch(`/api/nonce?address=${_address}`);
        const { nonce } = await rNonce.json();

        // get user to sign message + nonce
        const signature = await _signer.signMessage(messageToSign + nonce);

        // send the sign to the BE
        const rSig = await fetch('/api/signature', {
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

        localStorage.setItem('jwt', token.split(" ")[1]);
      }

      const r = await fetch(`/api/nickname?address=${_address}`);
      const json = await r.json();
      const _nickname = json.nickname;

      setSigner(_signer);
      setAddress(_address);
      setNickname(_nickname);
      setJwt(localStorage.getItem('jwt'));

      localStorage.setItem('Wallet', 'Connected');
    } catch (e) {
      console.log(e)
    }
  }

  const disconnect = async () => {
    setSigner(null);
    setAddress(null);
    setNickname(null);
    setJwt(null);
    localStorage.setItem('Wallet', 'Not Connected');
    localStorage.setItem('jwt', '');
  }

  return [connect, disconnect];
}