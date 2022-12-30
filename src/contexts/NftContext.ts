import { createContext } from 'react';
import { HodlCommentViewModel } from '../models/HodlComment';
import { MutableToken } from "../models/MutableToken";
import { Token } from "../models/Token";


export const NftContext = createContext<{
    nft: Token,
    mutableToken?: MutableToken,
    pinnedComment?: HodlCommentViewModel
}>({
    nft: null,
    mutableToken: null,
    pinnedComment: null
});

