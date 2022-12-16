import { messageToSign } from '../lib/messageToSign';

import axios from 'axios';
import { WalletContext } from '../contexts/WalletContext';
import { useContext } from 'react';
import { SignedInContext } from '../contexts/SignedInContext';


export const useSignIn = () => {
  const { walletAddress, signer } = useContext(WalletContext);
  const { setSignedInAddress } = useContext(SignedInContext);

  const signIn = async (uuid) => {

    if (!walletAddress || !signer || !uuid) {
      return;
    }

    const signature = await signer.signMessage(messageToSign + uuid);

    const r = await axios.post(
      '/api/auth/login',
      {
        signature,
        address: walletAddress
      },
      {
        headers: {
          'Accept': 'application/json'
        },
      }
    );

    setSignedInAddress(walletAddress);
  }

  return signIn;
}