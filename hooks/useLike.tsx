import { useState, useEffect, useContext } from 'react';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useLike = (token) => {
    const { address, jwt } = useContext(WalletContext);
    const [userLikesThisToken, setUserLikesThisToken] = useState(false);
    const [tokenLikesCount, setTokenLikesCount] = useState(null);
    const [connect] = useConnect();

    // @ts-ignore
    useEffect(async() => {
        if (!token) {
          return;
        }

        const r = await fetch(`/api/likeCount?token=${token.tokenId}`);
        if (r.status == 200) {
          const { count } = await r.json();
          setTokenLikesCount(count);
        }
        
    }, [token])

    // @ts-ignore
    useEffect(async() => {
        if (!token || !address) {
          return;
        }
        
        const r = await fetch(`/api/likes?address=${address}&token=${token.tokenId}`);
        if (r.status == 200) {
          const { likes } = await r.json();
          setUserLikesThisToken(likes);
        }
    }, [token, address])

    const toggleLike = async () => {
        if (!token) {
          return;
        }
        
        const r = await fetch('/api/like', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': jwt
            }),
            body: JSON.stringify({ token: token.tokenId })
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