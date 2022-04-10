import { Box, CircularProgress, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite'
import NftList from './NftList';
import { debounce } from 'underscore';

export const InfiniteScroll = ({ swrkey, fetcher, viewSale=false, showTop=true }) => {
    const limit = useRef(20);
    const lastY = useRef(0);
    const finished = useRef(false);

    const getKey = (index, previousData) => {
        if (previousData && previousData?.next === previousData?.total) {
            finished.current = true;
            return null 
        }
        return [swrkey, index * limit.current, limit.current]
      }

    const { data, size, isValidating, setSize } = useSWRInfinite(getKey, (_key, offset, limit) => fetcher(offset, limit))

    useEffect(() => {
        window.addEventListener('scroll', onScroll, { passive: true});
    }, []);

    const onScroll = debounce(() => {
        const ascending = window.scrollY > lastY.current;
        const yPosition = window.pageYOffset + window.innerHeight;
        const contentHeight = document.body.offsetHeight;
        
        if (ascending && yPosition > (contentHeight / 2) && !finished.current) {
            console.log('get more data')
            setSize(size => size + 1)
        }

        lastY.current = window.scrollY;
    }, 100)

    if (!data) {
        return <Box sx={{ padding: 5, display: "flex", justifyContent: "center" }}><CircularProgress color="secondary"/></Box>
     }

     console.log(data)
    return (
        <>
        <Stack spacing={2}>
            {data.map(page => page.items && <NftList nfts={page.items} viewSale={viewSale} showTop={showTop}/>)}
        </Stack>
        { !finished.current && isValidating && <Box sx={{ padding: 5, display: "flex", justifyContent: "center" }}><CircularProgress color="secondary"/></Box>}
        </>
    )
}
