import { createContext } from 'react';
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite';


export const RankingsContext = createContext<{
    rankings: SWRInfiniteResponse<any, any>,
}>({rankings: null});
