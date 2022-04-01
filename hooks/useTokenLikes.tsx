import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from "../pages/_app";

export const useTokenLikes = (token) => {
    const { address, jwt } = useContext(WalletContext);
    const [userLikesThisToken, setUserLikesThisToken] = useState(false);
    const [tokenLikesCount, setTokenLikesCount] = useState(null);

    // @ts-ignore
    useEffect(async() => {
        if (!token) {
          return;
        }

        const response = await fetch(`/api/likeCount?token=${token.tokenId}`);
        const json = await response.json();
        setTokenLikesCount(json.count);
    }, [token])

    useEffect(async() => {
        if (!token || !address) {
          return;
        }
        
        const response = await fetch(`/api/likes?address=${address}&token=${token.tokenId}`);
        const json = await response.json();
        setUserLikesThisToken(json.likes);
    }, [token, address])

    const toggleLike = async () => {
        if (!address || !token) {
          return;
        }
        
        console.log('jwt', jwt)
        const response = await fetch('/api/like', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': jwt
            }),
            body: JSON.stringify({ 
              address,
              token: token.tokenId
            })
          });
          const json = await response.json();
          setUserLikesThisToken(old => !old);
          setTokenLikesCount(old => json.liked ? old + 1 : old - 1);
    
    }

    return [tokenLikesCount, userLikesThisToken, toggleLike];
 
}