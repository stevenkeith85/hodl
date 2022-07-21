import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useFollowersCount = (address, fallbackData = null) => {

    const { data } = useSWR(
        address ? [`/api/followers/count`, address] : null,
        fetchWithAddress,
        { 
            revalidateOnMount: true,
            fallbackData
        }
    )

    return [data?.count];
}