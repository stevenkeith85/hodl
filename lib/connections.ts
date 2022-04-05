import { ethers } from 'ethers'

export const getMetaMaskSigner = async (returningUser=true) => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
  
    // if we've forgotten the user (because they asked to disconnect), then ask them to pick an account again
    if (!returningUser) {
      await provider.send("wallet_requestPermissions",  [{
        eth_accounts: {}
      }]);
    }
      
    // if we've remembered the user, then just connect
    await provider.send("eth_requestAccounts", []);  
    
    
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
  
    return signer;
  }
