import { useContext } from "react";
import useSWRInfinite from 'swr/infinite'
import { WalletContext } from "../contexts/WalletContext";
import { ActionSet } from "../models/HodlAction";
import axios from 'axios';


export const useActions = (
  getData: boolean,
  set: ActionSet = ActionSet.Notifications,
  limit: number
) => {
  const { address } = useContext(WalletContext);

  const fetcher = (url: string, set: ActionSet, offset: number, limit: number) => axios.get(
    url,
    {
      params: { set, offset, limit },
      headers: {
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      }
    }).then(r => r.data);


  const getKey = (index, _previous) => {
    return address && getData ? [`/api/actions`, set, index * limit, limit] : null;
  }

  const swr = useSWRInfinite(
    getKey,
    fetcher,
    {
      dedupingInterval: 10000,
      revalidateOnMount: true,
      revalidateFirstPage: true,
    }
  );

  return {
    actions: swr,
  }
}
