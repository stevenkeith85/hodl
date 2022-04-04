import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useFollow = () => {
  const { address, jwt } = useContext(WalletContext);
  const [isFollowing, setIsFollowing] = useState(null);
  const router = useRouter();
  const [connect] = useConnect();

  // @ts-ignore
  useEffect(async () => {
    if (address && router.query.address && address !== router.query.address) {
      const response = await fetch(`/api/follows?address1=${address}&address2=${router.query.address}`);
      const { follows } = await response.json();
      
      if (follows) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    }
  }, [address, router.query.address]);

  const follow = async () => {
    // if (!address) { return }

    if (!router?.query?.address) {
      return;
    }

    const r = await fetch('/api/follow', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': jwt
      }),
      body: JSON.stringify({ address: router?.query?.address })
    });

    if (r.status === 403) {
      await connect(false);
    } else if (r.status === 200) {
      setIsFollowing(old => !old);
    }
  }


  return [follow, isFollowing];
}