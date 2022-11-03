import { createContext } from 'react';
import { MutableToken } from '../models/Nft';
import { Token } from '../models/Token';


export const NftContext = createContext<{
    nft: Token,
    mutableToken: MutableToken
}>({
    nft: null,
    mutableToken: null
});

