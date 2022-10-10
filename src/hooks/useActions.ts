import useSWRInfinite from 'swr/infinite'
import { ActionSet, HodlActionViewModel } from "../models/HodlAction";
import axios from 'axios';
import { Fetcher } from "swr";


export const useActions = (
  getData: boolean,
  set: ActionSet = ActionSet.Notifications,
  limit: number,
  fallbackData = null,
) => {
  const fetcher: Fetcher<{ items: HodlActionViewModel[], next: number, offset: number }, [string, ActionSet, number, number]>
    = (url, set, offset, limit) => axios.get(
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
      fallbackData,
      revalidateOnMount: true,
      dedupingInterval: 2000, // default is 2000 - TODO: LOWERED THIS AS IM WORKING ON IT. IT CAN GO UP WHEN WORK IS DONE
      focusThrottleInterval: 5000, // default is 5000
    }
  );

  return {
    actions: swr,
  }
}
