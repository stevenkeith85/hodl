import useSWR, { Fetcher, SWRResponse } from 'swr';
import axios from 'axios'
import { User, UserViewModel } from '../models/User';

export const useUser = (address, fallbackData = null): SWRResponse<UserViewModel, any> => {

    const fetcher: Fetcher<UserViewModel, [string, string]> = (url, query) => axios.get(`${url}/${query}`).then(r => r.data.user);

    const swr = useSWR(
        address ? [`/api/user`, address] : null,
        fetcher,
        {
            fallbackData,
            revalidateOnMount: !fallbackData
        }
    )

    return swr;
}
