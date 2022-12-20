import useSWR, { Fetcher } from 'swr';
import { MutableToken } from '../models/MutableToken';

export const useMutableToken = (tokenId, fallbackData = null) => {

    const fetcher: Fetcher<MutableToken> = (url, id) => fetch(`${url}/${id}`).then(r => r.json()).then(data => data.mutableToken);
    
    const swr = useSWR(
        tokenId ? [`/api/contracts/mutable-token`, tokenId] : null,
        fetcher,
        {
            fallbackData,
            dedupingInterval: 15000,
            focusThrottleInterval: 15000,
        }
    );

    return swr;
}
