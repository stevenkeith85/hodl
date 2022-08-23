import { createContext } from 'react';


export const UserContext = createContext<{
    hodlingCount: number,
    listedCount: number,
    followersCount: number,
    followingCount: number
}>({
    hodlingCount: null,
    listedCount: null,
    followersCount: null,
    followingCount: null
});

