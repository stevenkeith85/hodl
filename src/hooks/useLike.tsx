import { useContext } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'


export const useLike = (
  id: number,
  object: "token" | "comment",
  likeCount: SWRResponse
): [boolean, Function] => {
  const { address } = useContext(WalletContext);

  const baseUrl = `/api/like/${object}`;

  const {
    data: userLikesThisToken,
    mutate: mutateUserLikesThisToken } = useSWR(
      address && id ? [baseUrl + '/likes', address, id] : null,
      (url, address, id) => axios.get(`${url}?address=${address}&id=${id}`).then(r => Boolean(r.data.likes))
    );

  const toggleLike = async () => {
    if (!address) {
      return;
    }
    likeCount.mutate(old => {
      console.log('old', old) // THIS SEEMS TO NOT WORK IF WE DO NOT REVALIDATE THE SWR ON MOUNT
      if (userLikesThisToken) {
        return old - 1;
      } else {
        return old + 1
      }        
    }, { revalidate: false });
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
    } catch (error) {
      likeCount.mutate();
      mutateUserLikesThisToken();
    }
  }

  return [userLikesThisToken, toggleLike];
}