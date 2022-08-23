import useSWRInfinite from 'swr/infinite'
import { fetchWithAddressOffsetLimit } from '../lib/swrFetchers';

export const useHodling = (address, limit = 10, fallbackData = null, load=true) => {

    // TODO: Change route to /api/hodling
    const getKey = (index, _previous) => {
        return load && limit ? [`/api/profile/hodling`, address, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        getKey,
        fetchWithAddressOffsetLimit,
        {
            fallbackData
        });


    return {
        swr
    };
}
