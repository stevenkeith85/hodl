import { useContext } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'
import { RankingsContext } from '../contexts/RankingsContext';

export const useLike = (
  id: number,
  object: "token" | "comment",
  likeCount: SWRResponse
) : [boolean, Function]=> {
  const { address } = useContext(WalletContext);

  const { mostLiked } = useContext(RankingsContext);
  
  const baseUrl = `/api/like/${object}`;

  const { data: userLikesThisToken, mutate: mutateUserLikesThisToken } = useSWR(
    address && id ? [baseUrl + '/likes', address, id] : null,
    (url, address, id) => axios.get(`${url}?address=${address}&id=${id}`).then(r => Boolean(r.data.likes))
  );

  const toggleLike = async () => {
    if (!address) {
      return;
    }
    
    mutateUserLikesThisToken(old => !old, { revalidate: false })

    try {
      const r = await axios.post(
        baseUrl,
        { id },
        {
          headers: {
            'Accept': 'application/json'
          },
        }
      )

      if (mostLiked) {
        mostLiked.mutate()
      }
      
      likeCount.mutate();

    } catch (error) {
      likeCount.mutate();
      mutateUserLikesThisToken();
    }
  }

  return [userLikesThisToken, toggleLike];
}