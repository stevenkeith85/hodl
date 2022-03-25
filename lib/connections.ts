import { ethers } from 'ethers'

export const getMetaMaskSigner = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum)
  
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
  
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
  
    return signer;
  }

  // TODO: Use correct provider for local, testnet, prod
  export const getProvider = async () => {
    return await new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545");
  }