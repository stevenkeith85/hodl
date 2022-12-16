import { useContext } from 'react';
import useSWR from 'swr';
import axios from 'axios'
import { SignedInContext } from '../contexts/SignedInContext';


export const useUserLikesObject = (
  id: number,
  object: "token" | "comment",
) => {
  const { signedInAddress: address } = useContext(SignedInContext);
  const baseUrl = `/api/like/${object}`;

  const swr = useSWR(
    address && id ? [baseUrl + '/likes', address, id] : null,
    (url, address, id) => axios.get(`${url}?address=${address}&id=${id}`).then(r => Boolean(r.data.likes)),
    {
      revalidateOnFocus: false,
    }
  );


  return swr;
}