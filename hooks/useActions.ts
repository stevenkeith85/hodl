import { useContext } from "react";
import useSWRInfinite from 'swr/infinite'
import { WalletContext } from "../contexts/WalletContext";
import { ActionSet, HodlActionViewModal } from "../models/HodlAction";
import axios from 'axios';
import { Fetcher } from "swr";


export const useActions = (
  getData: boolean,
  set: ActionSet = ActionSet.Notifications,
  limit: number,
  fallbackData = null,
) => {
  const fetcher: Fetcher<{ items: HodlActionViewModal[], next: number, offset: number }, [string, ActionSet, number, number]> = (url, set, offset, limit) => axios.get(
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
    fetcher
  );

  return {
    actions: swr,
  }
}
