import useSWRInfinite from 'swr/infinite'
import { ActionSet } from "../models/HodlAction";
import axios from 'axios';


export const useRankings = (
  getData: boolean,
  limit: number,
  fallbackData?: any
) => {

  const fetcher = (
    url: string, 
    offset: number, 
    limit: number) => axios.get(
    url,
    {
      params: { 
        offset, 
        limit 
      },
      headers: { // This endpoint is public at the moment; but we may make it private
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      }
    }).then(r => r.data);


  const getKey = (index, _previous) => {
    return getData ? [`/api/rankings`, index * limit, limit] : null;
  }

  const swr = useSWRInfinite(
    getKey,
    fetcher,
    {
      dedupingInterval: 5000,
      revalidateOnMount: true,
      revalidateFirstPage: true,
      fallbackData
    }
  );

  return {
    rankings: swr,
  }
}
