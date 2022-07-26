import { createContext } from 'react';
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite';


export const RankingsContext = createContext<{
    mostFollowed: SWRInfiniteResponse<any, any>,
    mostLiked: SWRInfiniteResponse<any, any>,
}>({
    mostFollowed: null,
    mostLiked: null
});
