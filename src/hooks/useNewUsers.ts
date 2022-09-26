import useSWRInfinite from 'swr/infinite'
import { fetchWithQueryOffsetLimit } from '../lib/swrFetchers';
    
export const useNewUsers = (limit=10, fallbackData=null) => {
    const getKey = (index, _previous) => {
        return [`/api/rankings/user/new`, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithQueryOffsetLimit, 
        { fallbackData });

    return { results: swr };
}
