import useSWR, { Fetcher, SWRResponse } from 'swr';
import axios from 'axios'
import { UserViewModel } from '../models/User';

export const useUser = (address, fallbackData = null, viewer = null, ): SWRResponse<UserViewModel, any> => {

    const fetcher: Fetcher<UserViewModel, [string, string, string]> = (url, handle, viewer) => axios.get(`${url}/${handle}${viewer ? `?viewer=${viewer}` : ''}`).then(r => r.data.user);

    const swr = useSWR(
        address ? [`/api/user`, address, viewer] : null,
        fetcher,
        {
            fallbackData,
            // revalidateOnMount: !fallbackData
        }
    )

    return swr;
}
