// import detectEthereumProvider from '@metamask/detect-provider'

import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from '@walletconnect/web3-provider';

export const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    display: {
      description: "Connect to your coinbase wallet"
    },
    options: {
      appName: "Hodl My Moon",
      infuraId: {
        137: `https://polygon-mainnet.infura.io/v3/{process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`
      }
    }
  },

  // https://stackoverflow.com/questions/69494765/wallet-connect-no-rpc-url-available-for-chainid-137
  walletconnect: {
    display: {
      description: "Connect to other wallets"
    },
    package: WalletConnect,
    options: {
      rpc: { 
        137: "https://matic-mainnet.chainstacklabs.com",
        80001: "https://matic-mumbai.chainstacklabs.com",
      },
      qrcodeModalOptions: {
        desktopLinks: [
          'ledger',
          'tokenary',
          'wallet',
          'wallet 3',
          'secuX',
          'ambire',
          'wallet3',
          'apolloX',
          'zerion',
          'sequence',
          'punkWallet',
          'kryptoGO',
          'nft',
          'riceWallet',
          'vision',
          'keyring'
        ],
        mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          "imtoken",
          "pillar",
        ],
      },
    }
  }
};


export const getSigner = async (dialog) => {
  try {
    const { Web3Provider } = await import('@ethersproject/providers');

    const web3Modal = new Web3Modal({
      // disableInjectedProvider: true,
      cacheProvider: true,
      providerOptions,
    });

    if (dialog) {
      web3Modal.clearCachedProvider();
    }
    

    const instance = await web3Modal.connect();

    const provider = new Web3Provider(instance);
    const signer = provider.getSigner();

    return ({
      provider,
      signer
    });
  } catch (error) {
    console.log(error);
  }


}
