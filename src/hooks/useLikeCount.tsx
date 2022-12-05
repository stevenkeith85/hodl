import useSWR, { Fetcher } from 'swr';
import axios from 'axios'

export const useLikeCount = (
  id: number,
  object: "token" | "comment",
  prefetchedLikeCount = null
) => {
  
  const fetcher : Fetcher<number, [string, number]>= (url, id) => axios.get(`${url}?id=${id}`).then(r => r.data);

  const swr = useSWR(
    id ? [`/api/like/${object}/count`, id] : null,
    fetcher,
    {
      fallbackData: prefetchedLikeCount,
      revalidateOnMount: prefetchedLikeCount === null, // if we don't revalidate on mount for somereason calling mutate doesn't seem to work
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return swr
}