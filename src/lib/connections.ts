const metaMaskInstalled = () => {
  // @ts-ignore
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
}

export const getMetaMaskSigner = async (returningUser = true) => {
  
  if (metaMaskInstalled()) {

    const { Web3Provider } = await import('@ethersproject/providers');

    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page

    // @ts-ignore
    const provider = new Web3Provider(window.ethereum);


    // This lets them select which account to connect with if they have multiple
    if (!returningUser) {
      try {
        await provider.send("wallet_requestPermissions", [{ eth_accounts: {} }]);
      } catch (e) {
        // This RPC method is not yet available in MetaMask Mobile. 
      }
    }

    // if we've remembered the user, then just connect
    await provider.send("eth_requestAccounts", []);

    return provider.getSigner();

  } else {
    return false;
  }
}
