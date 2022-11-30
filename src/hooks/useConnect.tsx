import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'
import { PusherContext } from '../contexts/PusherContext';
import { messageToSign } from '../lib/messageToSign';

// import Web3Modal from "web3modal";
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import WalletConnect from '@walletconnect/web3-provider';
// import { switchToPolygon } from '../lib/switchToPolygon';

import { enqueueSnackbar } from 'notistack';
import { getSigner } from '../lib/connections';


export const useConnect = () => {
  // const { pusher, setPusher, setUserSignedInToPusher } = useContext(PusherContext);
  const { setSigner, setProvider, setAddress } = useContext(WalletContext);

  // useEffect(() => {

  // }, [signature])

  // we ask which account they want if they aren't a returning user (i.e. they've logged out)
  // we can also connect returningusers to update their jwt
  const connect = async (authenticateWithBE = false): Promise<Boolean> => {
    try {

      const { provider, signer } = await getSigner(true);

      // We need the signer to log them in to the backend
      if (!signer) {
        console.log("Unable to get signer")
        return false;
      }

      const address = await signer.getAddress();

      if (authenticateWithBE) {

        const { uuid } = await axios.get(`/api/auth/uuid?address=${address}`).then(r => r.data);

        enqueueSnackbar("Check your wallet", {
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

          } catch (error) {
            console.log(error);
            enqueueSnackbar("Unable to log you in. Please contact support if the problem persists.", {
              variant: "error",
              hideIconVariant: true
            });
            await disconnectFE();
            return false;
          }

        } catch (error) {
          console.log(error);
          enqueueSnackbar("You rejected the signature request", {
            variant: "info",
            hideIconVariant: true
          });
          return false
        }
      }

      // alert("already connected, just setting the state")
      await connectFE(provider, signer, address);

      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  // TODO: pusher done elsewhere; should it be?
  const connectFE = async (provider, signer, address) => {
    setProvider(provider);
    setSigner(signer);
    setAddress(address);
  }

  const disconnectFE = async () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);

    // TODO: do this somewhere
    // pusher?.disconnect();
    // setUserSignedInToPusher(null);
    // setPusher(null);
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