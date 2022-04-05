import { ethers } from 'ethers'
    
export const getProvider = async () => {
    // TODO: 
    // We need to use correct provider for local, testnet, and prod
    // For local we can just hit the hardhat node. For the other environments we should set up Infura/Alchemy API access
    // if (env === 'development') {
    //   return await new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545");  
    // }
    return await new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545");
}
