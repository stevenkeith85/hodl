import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { messageToSign } from '../lib/messageToSign';

import { getProviderSignerAddress } from '../lib/getSigner';


export const useConnect = () : [Function, Function]=> {
  const { setProvider, setSigner, setAddress } = useContext(WalletContext);

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (authenticateWithBE = false, dialog = false): Promise<Boolean> => {
    try {
      const { provider, signer, address } = await getProviderSignerAddress(dialog);
      
      // We need the signer to log them in to the backend
      if (!signer) {
        console.log("Unable to get signer")
        return false;
      }

      let success = true;
      if (authenticateWithBE) {
        success = await connectBE(signer, address);
      }

      if (success) {
        setWalletContext(provider, signer, address);
      }
      
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  // // TODO: pusher done elsewhere; should it be?
  const setWalletContext = async (provider, signer, address) => {
    setProvider(provider);
    setSigner(signer);
    setAddress(address);
  }

  const connectBE = async (signer, address) => {
    const enqueueSnackbar = await import('notistack').then(mod => mod.enqueueSnackbar);
    try {
      const {default: axios} = await import('axios');
      const { uuid } = await axios.get(`/api/auth/uuid?address=${address}`).then(r => r.data);

      enqueueSnackbar("Sign the message in your wallet to log in", {
        variant: "info",
        hideIconVariant: true
      });

      try {
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

          return true;
        } catch (error) {
          enqueueSnackbar("Unable to log you in. Please contact support if the problem persists.", {
            variant: "error",
            hideIconVariant: true
          });

          console.log(error);
          return false;
        }

      } catch (error) {
        enqueueSnackbar("You rejected the signature request", {
          variant: "info",
          hideIconVariant: true
        });
        console.log(error);
        return false
      }
    } catch (e) {
      enqueueSnackbar("Sorry, we've had a problem. Please contact support if it persists.", {
        variant: "info",
        hideIconVariant: true
      });
      console.log('Unable to connect to the BE');
      console.log(e)
      return false;
    }
  }

  return [connect, connectBE];
}