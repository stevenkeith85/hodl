import { useContext } from 'react';
import useSWR from 'swr';
import { hasExpired } from '../lib/utils';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useFollow = (profileAddress) => {
  const { address } = useContext(WalletContext);
  const [connect] = useConnect();

  const {data: isFollowing, mutate } = useSWR(address && address !== profileAddress ? [`/api/follow/follows`, address, profileAddress] : null, 
                                                            (url, address, profileAddress) => fetch(`${url}?address1=${address}&address2=${profileAddress}`)
                                                                                              .then(r => r.json())
                                                                                              .then(json => Boolean(json.follows)));


  const follow = async () => {
    if (hasExpired(localStorage.getItem('jwt'))) {
      await connect(true, true);
    }
    
    const r = await fetch('/api/follow/follow', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      }),
      body: JSON.stringify({ address: profileAddress })
    });

    if (r.status === 403) {
      await connect(false);
      return false;
    } else if (r.status === 200) {
      mutate(!isFollowing, { revalidate: false});
      return true;
    }
  }


  return [follow, isFollowing];
}