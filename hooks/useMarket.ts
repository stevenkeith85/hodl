import useSWRInfinite from 'swr/infinite'
import { fetchWithOffsetLimit } from '../lib/swrFetchers';
    
export const useMarket = (limit=10, prefetchedMarket=null) => {
    const getKey = (index, _previous) => {
        console.log('here', index, _previous)
        return [`/api/market/listed`, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithOffsetLimit, 
        { fallbackData: prefetchedMarket });


    return [swr];
}
