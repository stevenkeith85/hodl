import { ethers } from 'ethers'
    
export const getProvider = () => {
    // See https://docs.ethers.io/v5/api/providers/
    if (JSON.parse(process.env.LOCAL_BLOCKCHAIN_NODE)) {
        return ethers.getDefaultProvider(process.env.DEFAULT_PROVIDER_NETWORK);
    } else {
        const options = {
            infura: { 
                projectId: process.env.INFURA_IPFS_PROJECT_ID, 
                projectSecret: process.env.INFURA_PROJECT_SECRET 
            }
        }

        return ethers.getDefaultProvider(process.env.DEFAULT_PROVIDER_NETWORK, options);
    }
}
