import { createContext } from 'react';
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite';


export const FollowingContext = createContext<{
    following: SWRInfiniteResponse<any, any>,
}>({following: null});
