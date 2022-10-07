import useSWRInfinite from 'swr/infinite'
import { fetchWithAddressOffsetLimit } from '../lib/swrFetchers';

export const useListed = (address, limit = 10, fallbackData=null) => {

    // TODO: Change route to /api/listed
    const getKey = (index, _previous) => {
        return [`/api/profile/listed`, address, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithAddressOffsetLimit, 
        { 
            fallbackData
        });


    return { swr }
}




