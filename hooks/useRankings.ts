import useSWRInfinite from 'swr/infinite'
import axios from 'axios';


export const useRankings = (
  getData: boolean,
  limit: number,
  fallbackData?: any,
  object: "token" | "user" = "user"
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
      headers: {
        'Accept': 'application/json',
      }
    }).then(r => r.data);


  const getKey = (index, _previous) => {
    return getData ? [`/api/rankings/${object}`, index * limit, limit] : null;
  }

  const swr = useSWRInfinite(
    getKey,
    fetcher,
    { fallbackData }
  );

  return {
    rankings: swr,
  }
}
