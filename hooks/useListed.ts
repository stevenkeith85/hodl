import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { fetchWithAddress, fetchWithAddressOffsetLimit } from '../lib/swrFetchers';

export const useListed = (address, limit = 10, prefetchedListedCount = null, prefetchedListed = null) => {

    const { data: listedCount } = useSWR(
        address ? [`/api/profile/listedCount`, address] : null,
        fetchWithAddress,
        { 
            fallbackData: prefetchedListedCount,
            revalidateOnMount: true
        }
    )

    const getKey = (index, _previous) => {
        return [`/api/profile/listed`, address, index * limit, limit];
    }

    const swr = useSWRInfinite(
        getKey, 
        fetchWithAddressOffsetLimit, 
        { 
            fallbackData: prefetchedListed,
            revalidateOnMount: true
        });


    return [listedCount?.count, swr];
}




