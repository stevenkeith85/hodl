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
            revalidateOnMount: fallbackData === null,
            dedupingInterval: 20000, // default is 2000. we can set this pretty high, as we call mutate as the correct time
            focusThrottleInterval: 20000, // default is 5000.  we can set this pretty high, as we call mutate as the correct time
            errorRetryCount: 0
        }
    )

    return swr;
}
