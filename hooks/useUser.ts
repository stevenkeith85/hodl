import useSWR, { Fetcher } from 'swr';
import axios from 'axios'
import { User } from '../models/User';

export const useUser = (address, fallbackData) : User | null => {

    const fetcher: Fetcher<User, [string, string]> = (url, query)  => axios.get(`${url}/${query}`).then(r => r.data.user);

    const { data: user } = useSWR(
        [`/api/user`, address],
        fetcher,
        { fallbackData }
    )

    return user;
}
