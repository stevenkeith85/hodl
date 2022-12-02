import { ActionSet } from "../models/HodlAction";
import axios from 'axios';
import useSWRInfinite from 'swr/infinite'


// This is really only for the feed at the moment; as it doesn't revalidate the 1st page (notifications would require that)
export const useActions2 = (address, set = ActionSet.Feed, limit=14) => {

  const getKey = (index, previous) => {
    if (previous?.next > previous?.total) {
      return null;
    }

    if (index === 0) {
      return [address, `/api/actions`, set, 0, limit]
    }

    return [address, `/api/actions`, set, previous.next, limit]
  }

  const fetcher = (_address, url, set, offset, limit) => axios.get(url, {
    params: { set, offset, limit },
    headers: {
      'Accept': 'application/json',
    }
  }).then(response => response.data);

  const swr = useSWRInfinite(
    address ? getKey : null,
    fetcher,
    {
      revalidateFirstPage: false,
      shouldRetryOnError: true,
      errorRetryCount: 1
    }
  );

  return swr;
}
