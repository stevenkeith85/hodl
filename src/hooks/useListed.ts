import useSWRInfinite from 'swr/infinite'
import { fetchWithAddressOffsetLimit } from '../lib/swrFetchers';

export const useListed = (address, limit = 10, fallbackData=null, load=true) => {

    const getKey = (index, _previous) => {
        return load && limit ? [`/api/contracts/market/listed`, address, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithAddressOffsetLimit, 
        { 
            fallbackData,
            shouldRetryOnError: false
        });


    return { swr }
}

