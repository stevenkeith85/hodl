import { createContext } from 'react';
import { Nft } from '../models/Nft';


export const NftContext = createContext<{
    nft: Nft
}>({
    nft: null
});

