import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useHodlingCount = (address, fallbackData=null) => {
   
    // TODO: Change route to /api/hodling/count
    const { data } = useSWR(
        address ? [`/api/profile/hodlingCount`, address] : null,
        fetchWithAddress,
        {
            fallbackData
        }
    )

    return [data];
}