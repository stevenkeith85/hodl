import { useState, useEffect, useContext } from 'react';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useLike = (tokenId) => {
    const { address, jwt } = useContext(WalletContext);
    const [userLikesThisToken, setUserLikesThisToken] = useState(false);
    const [tokenLikesCount, setTokenLikesCount] = useState(null);
    const [connect] = useConnect();

    // @ts-ignore
    useEffect(async() => {
        const r = await fetch(`/api/like/likeCount?token=${tokenId}`);
        if (r.status == 200) {
          const { count } = await r.json();
          setTokenLikesCount(count);
        }
        
    }, [tokenId])

    // @ts-ignore
    useEffect(async() => {
        if (!address) {
          return;
        }
        
        const r = await fetch(`/api/like/likes?address=${address}&token=${tokenId}`);
        if (r.status == 200) {
          const { likes } = await r.json();
          setUserLikesThisToken(likes);
        }
    }, [tokenId, address])

    const toggleLike = async () => {        
        const r = await fetch('/api/like/like', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': jwt
            }),
            body: JSON.stringify({ token: tokenId })
          });

          if (r.status === 403) {
            await connect(false);
          } else if (r.status === 200) {
            const { liked } = await r.json();
            setUserLikesThisToken(old => !old);
            setTokenLikesCount(old => liked ? old + 1 : old - 1);
          }
    }

    return [tokenLikesCount, userLikesThisToken, toggleLike];
}