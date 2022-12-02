import { JsonRpcProvider } from '@ethersproject/providers'
import { getDefaultProvider } from "@ethersproject/providers";

let provider = null;

const createProvider = () => {
    if (JSON.parse(process.env.LOCAL_BLOCKCHAIN_NODE)) {
        provider = getDefaultProvider(process.env.DEFAULT_PROVIDER_NETWORK);
    } else {
        provider = new JsonRpcProvider(`${process.env.QUICKNODE_URL}/${process.env.QUICKNODE_AUTHENTICATION_TOKEN}`);
    }
}


export const getProvider = () => {

    if (!provider) {
        createProvider();
    }

    return provider;
}
