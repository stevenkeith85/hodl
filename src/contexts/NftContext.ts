import { createContext } from 'react';
import { FullToken, MutableToken } from '../models/Nft';


export const NftContext = createContext<{
    nft: FullToken,
    mutableToken: MutableToken
}>({
    nft: null,
    mutableToken: null
});

