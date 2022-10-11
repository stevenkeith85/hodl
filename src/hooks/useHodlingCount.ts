import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useHodlingCount = (address, fallbackData=null) => {
   
    const { data } = useSWR(
        address ? [`/api/contracts/token/hodling/count`, address] : null,
        fetchWithAddress,
        {
            fallbackData
        }
    )

    return [data];
}