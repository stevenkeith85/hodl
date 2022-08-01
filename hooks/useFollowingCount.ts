import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useFollowingCount = (address, fallbackData=null) => {

    const { data } = useSWR(
        address ? [`/api/following/count`, address] : null,
        fetchWithAddress,
        { 
            fallbackData
        }
    )

    return [data];
}