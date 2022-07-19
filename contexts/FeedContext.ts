import { createContext } from 'react';
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite';


export const FeedContext = createContext<{
    feed: SWRInfiniteResponse<any, any>,
}>({feed: null});
