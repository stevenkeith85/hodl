import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'


export const useLike = (
  id: number,
  object: "token" | "comment"
) => {
  const { address } = useContext(WalletContext);
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