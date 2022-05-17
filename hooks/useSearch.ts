import useSWRInfinite from 'swr/infinite'
import { fetchWithQueryOffsetLimit } from '../lib/swrFetchers';
    
export const useSearch = (q, limit=10, prefetchedResults=null) => {
    const getKey = (index, _previous) => {
        return [`/api/search/results`, q, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithQueryOffsetLimit, 
        { fallbackData: prefetchedResults });


    return [swr];
}
