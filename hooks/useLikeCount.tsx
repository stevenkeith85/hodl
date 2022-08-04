import useSWR, { Fetcher } from 'swr';
import axios from 'axios'

export const useLikeCount = (
  id: number,
  object: "token" | "comment",
  prefetchedLikeCount = null
) => {
  
  const fetcher : Fetcher<number, [string, number]>= (url, id) => axios.get(`${url}?id=${id}`).then(r => r.data);

  const { data } = useSWR(
    id ? [`/api/like/${object}/count`, id] : null,
    fetcher,
    {
      fallbackData: prefetchedLikeCount
    }
  );

  return data;
}