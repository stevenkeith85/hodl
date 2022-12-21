export const getProviderSignerAddress = async (dialog = false) => {
  const { default: CoinbaseWalletSDK } = await import("@coinbase/wallet-sdk");
  const { default: WalletConnect } = await import('@walletconnect/web3-provider');


  const providerOptions = {
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      display: {
        description: "Connect to your coinbase wallet"
      },
      options: {
        appName: "Hodl My Moon",
        infuraId: process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY,
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`,
          137: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`,
          80001: `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`
        },
      }
    },
    walletconnect: {
      display: {
        description: "Connect to other wallets"
      },
      package: WalletConnect,
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY,
        rpc: {
          1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`,
          137: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`,
          80001: `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`
        },
        qrcodeModalOptions: {
          desktopLinks: [
            'ambire',
            'sequence',
          ],
          mobileLinks: [
            "rainbow",
            "metamask",
            "trust",
            "pillar",
          ],
        },
      }
    }
  };

  try {
    const { default: Web3Modal } = await import("web3modal");
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
    
    const provider = new Web3Provider(instance, 'any');
    const signer = provider?.getSigner();
    const address = await signer?.getAddress();

    return ({
      provider,
      signer,
      address
    });
  } catch (error) {
    return ({
      provider: null,
      signer: null,
      address: null
    });
  }


}
