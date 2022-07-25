import { useContext } from "react";
import useSWRInfinite from 'swr/infinite'
import { WalletContext } from "../contexts/WalletContext";
import { ActionSet } from "../models/HodlAction";
import axios from 'axios';


export const useActions = (
  getData: boolean,
  set: ActionSet = ActionSet.Notifications,
  limit: number,
  fallbackData = null,
) => {
  const fetcher = (url: string, set: ActionSet, offset: number, limit: number) => axios.get(
    url,
    {
      params: { set, offset, limit },
      headers: {
        'Accept': 'application/json',
      }
    }).then(r => r.data);


  const getKey = (index, _previous) => {
    return getData ? [`/api/actions`, set, index * limit, limit] : null;
  }

  const swr = useSWRInfinite(
    getKey,
    fetcher,
    {
      dedupingInterval: 2000, // default is 2000
        focusThrottleInterval: 5000, // default is 5000
      revalidateOnMount: true,
      revalidateFirstPage: true,
      fallbackData
    }
  );

  return {
    actions: swr,
  }
}
