import { createContext } from 'react';
import { FullToken } from '../models/Nft';


export const NftContext = createContext<{
    nft: FullToken
}>({
    nft: null
});

