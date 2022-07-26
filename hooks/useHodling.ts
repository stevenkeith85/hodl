import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { fetchWithAddress, fetchWithAddressOffsetLimit } from '../lib/swrFetchers';

export const useHodling = (address, limit = 10, prefetchedHodlingCount = null, prefetchedHodling = null, load=true) => {

    const { data: hodlingCount } = useSWR(
        address ? [`/api/profile/hodlingCount`, address] : null,
        fetchWithAddress,
        {
            fallbackData: prefetchedHodlingCount
        }
    )

    const getKey = (index, _previous) => {
        return load && limit ? [`/api/profile/hodling`, address, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        getKey,
        fetchWithAddressOffsetLimit,
        {
            fallbackData: prefetchedHodling
        });


    return [hodlingCount?.count, swr];
}
