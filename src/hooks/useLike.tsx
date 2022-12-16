import { useContext } from 'react';
import axios from 'axios'
import { SignedInContext } from '../contexts/SignedInContext';


export const useLike = (
  id: number,
  object: "token" | "comment"
) => {
  const { signedInAddress: address } = useContext(SignedInContext);
  const baseUrl = `/api/like/${object}`;

  const toggleLike = async () => {
    if (!address) {
      return;
    }

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
    }
  }

  return toggleLike;
}