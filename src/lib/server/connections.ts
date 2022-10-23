// import { ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getDefaultProvider } from "@ethersproject/providers";

export const getProvider = () => {
    // See https://docs.ethers.io/v5/api/providers/
    if (JSON.parse(process.env.LOCAL_BLOCKCHAIN_NODE)) {
        return getDefaultProvider(process.env.DEFAULT_PROVIDER_NETWORK);
    } else {
        return new JsonRpcProvider(`${process.env.QUICKNODE_URL}/${process.env.QUICKNODE_AUTHENTICATION_TOKEN}`);
    }
}
