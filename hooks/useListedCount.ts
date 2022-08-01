import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useListedCount = (address, fallbackData=null) => {

    // TODO: Change route to /api/listed/count
    const { data: listedCount } = useSWR(
        address ? [`/api/profile/listedCount`, address] : null,
        fetchWithAddress,
        { 
            fallbackData
        }
    )

    return [listedCount];
}




