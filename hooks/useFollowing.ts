import axios from 'axios';
import useSWRInfinite from 'swr/infinite'


export const useFollowing = (getData, address, limit = 10) => {
    const fetcher = (url: string, address: string, offset: number, limit: number) => axios.get(
        url,
        {
            params: { address, offset, limit },
            headers: {
                'Accept': 'application/json',
            }
        }).then(r => r.data);


    const getKey = (index, _previous) => {
        return getData ? [`/api/following`, address, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        getKey,
        fetcher,
        {
            dedupingInterval: 5000,
            revalidateOnMount: true,
            revalidateFirstPage: true
        }
    );

    return {
        swr
    }
}