import { ActionSet } from "../models/HodlAction";
import axios from 'axios';
import { useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import useSWRInfinite from 'swr/infinite'


export const useActions2 = (set = ActionSet.Feed, limit=14) => {
  const { address } = useContext(WalletContext);

  const getKey = (index, previous) => {
    if (previous?.next > previous?.total) {
      return null;
    }

    if (index === 0) {
      return [address, `/api/actions`, set, 0, limit]
    }

    console.log('offset is ', previous.next)
    return [address, `/api/actions`, set, previous.next, limit]
  }

  const fetcher = (_address, url, set, offset, limit) => axios.get(url, {
    params: { set, offset, limit },
    headers: {
      'Accept': 'application/json',
    }
  }).then(response => response.data);

  const swr = useSWRInfinite(
    getKey,
    fetcher,
  );

  return swr;
}
