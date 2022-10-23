import { createContext } from 'react';
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite';


export const RankingsContext = createContext<{
    limit: number,
    mostFollowed: SWRInfiniteResponse<any, any>,
    mostLiked: SWRInfiniteResponse<any, any>,
    // mostUsedTags: SWRInfiniteResponse<any, any>,
    newUsers: SWRInfiniteResponse<any, any>,
    newTokens: SWRInfiniteResponse<any, any>,
}>({
    limit: null,
    mostFollowed: null,
    mostLiked: null,
    // mostUsedTags: null,
    newUsers: null,
    newTokens: null
});
