import useSWRInfinite from 'swr/infinite'
import { fetchWithOffsetLimit } from '../lib/swrFetchers';
    
// TODO: We don't really need this now, as we look up redis instead of the blockchain
export const useMarket = (limit=10, prefetchedMarket=null) => {
    const getKey = (index, _previous) => {
        return [`/api/market`, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithOffsetLimit, 
        { fallbackData: prefetchedMarket });


    return [swr];
}
