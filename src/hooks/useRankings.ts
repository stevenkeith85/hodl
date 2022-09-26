import useSWRInfinite from 'swr/infinite'
import axios from 'axios';

// TODO: This relies on the endpoints being /index at the moment. Probably will want to change this
// or split off some new hooks instead
export const useRankings = (
  getData: boolean,
  limit: number,
  fallbackData?: any,
  object: "token" | "user" | "tag" = "user"
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
