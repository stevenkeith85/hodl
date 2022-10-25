import { Web3Provider } from '@ethersproject/providers'

export const getMetaMaskSigner = async (returningUser=true) => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    // @ts-ignore
    const provider = new Web3Provider(window.ethereum);
  
    // This lets them select which account to connect with if they have multiple
    if (!returningUser) {
      try {
        await provider.send("wallet_requestPermissions",  [{ 
          eth_accounts: {}
        }]);
      } catch(e) {
        // This RPC method is not yet available in MetaMask Mobile. 
      } 
    }

    
    // if we've remembered the user, then just connect
    await provider.send("eth_requestAccounts", []);  
    
    
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()

    return signer;
  }
