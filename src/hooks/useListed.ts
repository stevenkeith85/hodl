import useSWRInfinite from 'swr/infinite'
import { fetchWithAddressOffsetLimit } from '../lib/swrFetchers';

export const useListed = (address, limit = 10, fallbackData=null) => {

    const getKey = (index, _previous) => {
        return [`/api/contracts/market/listed`, address, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithAddressOffsetLimit, 
        { 
            fallbackData
        });


    return { swr }
}




