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
        infuraId: {
          137: `https://polygon-mainnet.infura.io/v3/{process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`,
          80001: `https://polygon-mumbai.infura.io/v3/{process.env.NEXT_PUBLIC_INFURA_NODE_API_KEY}`,
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

  try {
    const { default: Web3Modal } = await import("web3modal");
    const { Web3Provider } = await import('@ethersproject/providers');

    const web3Modal = new Web3Modal({
      network: "polygon",
      // disableInjectedProvider: true,
      cacheProvider: true,
      providerOptions,
    });

    if (dialog) {
      web3Modal.clearCachedProvider();
    }

    const instance = await web3Modal.connect();

    const provider = new Web3Provider(instance);

    // TODO: Do we need this. 
    //   provider.on("network", (newNetwork, oldNetwork) => {
    //     // When a Provider makes its initial connection, it emits a "network"
    //     // event with a null oldNetwork along with the newNetwork. So, if the
    //     // oldNetwork exists, it represents a changing network
    //     // alert("old " + oldNetwork?.name);
    //     // alert("new " + newNetwork.name);

    //     if (oldNetwork) {
    //         window.location.reload();
    //     }
    // });

    const signer = provider?.getSigner();
    const address = await signer?.getAddress();

    return ({
      provider,
      signer,
      address
    });
  } catch (error) {
    console.log(error.message);
    return ({
      provider: null,
      signer: null,
      address: null
    });
  }


}
