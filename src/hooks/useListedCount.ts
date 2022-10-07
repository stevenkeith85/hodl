import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useListedCount = (address, fallbackData=null) => {

    const { data: listedCount } = useSWR(
        address ? [`/api/contracts/market/listedCount`, address] : null,
        fetchWithAddress,
        { 
            fallbackData
        }
    )

    return [listedCount];
}




