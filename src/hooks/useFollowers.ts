import axios from 'axios';
import { Fetcher } from 'swr';
import useSWRInfinite from 'swr/infinite'
import { User } from '../models/User';


export const useFollowers = (getData, address, limit = 10, fallbackData = null) => {

    const fetcher: Fetcher<[{ items: User[], total: number, offset: number }, string, number, number]> = (url: string, address: string, offset: number, limit: number) => axios.get(
        url,
        {
            params: { address, offset, limit },
            headers: {
                'Accept': 'application/json',
            }
        }).then(r => r.data);


    const getKey = (index, _previous) => {
        return getData ? [`/api/followers`, address, index * limit, limit] : null;
    }

    const swr = useSWRInfinite(
        getKey,
        fetcher,
        {
            fallbackData,
            shouldRetryOnError: false
        }
    );

    return {
        swr
    }
}