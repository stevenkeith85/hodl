import useSWRInfinite from 'swr/infinite'
import { fetchWithOffsetLimit } from '../lib/swrFetchers';
    
export const useNewUsers = (limit=10, fallbackData=null) => {
    const getKey = (index, _previous) => {
        return [`/api/rankings/user/new`, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithOffsetLimit, 
        { fallbackData }
        );

    return { results: swr };
}
