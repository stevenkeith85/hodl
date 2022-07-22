import { createContext } from 'react';
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite';


export const FollowersContext = createContext<{
    followers: SWRInfiniteResponse<any, any>,
}>({followers: null});
