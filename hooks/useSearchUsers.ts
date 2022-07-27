import useSWRInfinite from 'swr/infinite'
import { fetchWithQueryOffsetLimit } from '../lib/swrFetchers';
    
export const useSearchUsers = (q, limit=10, fallbackData=null) => {
    const getKey = (index, _previous) => {
        return [`/api/search/users`, q, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithQueryOffsetLimit, 
        { fallbackData });


    return { results: swr };
}
