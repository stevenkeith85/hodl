/* pages/index.js */
import { useEffect, useRef, useState } from 'react'
import { fetchMarketItems } from '../lib/nft.js'
import { Box, CircularProgress, Button, Stack, Typography } from '@mui/material'
import NftList from '../components/NftList'
import InformationBox from '../components/InformationBox'
import { DiamondTitle } from '../components/DiamondTitle'
import useSWR from 'swr'
import Head from 'next/head'
import { HodlButton } from '../components/HodlButton'

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const InfiniteSlide = ({
    fetcherFn, nftsPerPage, viewSale=true, swrKey
}) => {
  const myRef = useRef(null);

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [next, setNext] = useState(0);
  const [prev, setPrev] = useState(0);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(nftsPerPage * 4);

  const [clientOffset, setClientOffset] = useState(0);
  const [clientLimit, setClientLimit] = useState(nftsPerPage);

  const previousClientOffset = usePrevious(clientOffset);

  const fetcher = (swrKey, offset, limit) => fetcherFn(offset, limit);
  const { data, error } = useSWR([swrKey, offset, limit], fetcher);
 
  const load = async () => {   
    if (!data) { 
      return; 
    }

    const [items, nextOffset, total] = data;

    setNfts(old => {

      const newArray = [
        ...old.slice(0, offset),
        ...items,
        ...old.slice(offset + items.length, ),
      ]

      if (offset === next) { // moving forwards  
         const sizeToTruncate = Math.floor(offset/4);
         return [...Array(sizeToTruncate).fill(null), ...newArray.slice(sizeToTruncate,)] // we use the indices so fill with null
      } else {
        const indexToTruncateFrom = (offset + limit) + Math.floor(limit/2); // we can truncate the array here at we don't need the indices

        return [...newArray.slice(0, indexToTruncateFrom)]
      }
    });

    if (BigInt(nextOffset) !== BigInt(total)) {
      setNext(nextOffset);
    }

    if (offset - limit >= 0) {
      setPrev(offset - limit);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    load();
  }, [data]);

  useEffect(() => {
    const ascending = clientOffset >= (previousClientOffset || 0);

    if (nfts.length && ascending && (nfts.length - (clientOffset + clientLimit) <= (clientLimit * 2))) {
      setOffset(next);
     } 
    else if (nfts.length && !ascending && clientOffset - nfts.filter(nft => !nft).length <= (clientLimit * 2)) { 
    // clientOffset - nfts.filter(nft => !nft).length is how many items we have in front of us that arent null. If there's only two pages to scroll, get more data
    setOffset(prev);
    }
  }, [clientOffset])

  if (loading) {
    return (
      <Box sx={{ marginTop: "40vh", display: 'flex', justifyContent: "center", alignItems: "center", alignContent: "center"}}>
        <CircularProgress color="secondary" />
      </Box>
    );  
  } 
  
  if (!nfts.length) {
    return <InformationBox message = "No items" />
  }

  return (
    <>
    <Head>
      {nfts.map(nft => {
        if (!nft) {return null;}
        const link = `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_550,q_auto/nfts/${nft.image}`;

        return (<link key={link} rel="preload" as="image" href={link}/>)
      })
    }
    </Head>
    <Stack spacing={2} ref={myRef}>
    { Boolean(!loading) && 
      <NftList nfts={nfts.slice(clientOffset,  clientOffset + clientLimit)} viewSale={viewSale} />              
    }
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <HodlButton 
          disabled={clientOffset < clientLimit} 
          variant="outlined" 
          color="secondary" 
          sx={{ width: 100 }} 
          onClick={() => {
            setClientOffset(old => old - clientLimit);
            myRef.current.scrollIntoView();
          }}>Prev</HodlButton>  
        <HodlButton 
          disabled={(nfts.length - clientOffset) <= clientLimit} 
          variant="outlined" 
          sx={{ width: 100 }} 
          onClick={() => {
            setClientOffset(old => old + clientLimit);
            myRef.current.scrollIntoView();
        }}>Next</HodlButton>
      </Stack>

    </Stack>
    </>
  ) 
}
