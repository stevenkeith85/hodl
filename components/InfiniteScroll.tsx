import { Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite'
import NftList from './NftList';
import { debounce } from 'underscore';
import { HodlLoadingSpinner } from './HodlLoadingSpinner';

export const InfiniteScroll = ({ swrkey, fetcher, viewSale=false, showTop=true, prefetchedData=null, revalidateOnMount=true, showAvatar=true, showName=true }) => {
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

    const { data, isValidating, setSize } = useSWRInfinite(getKey, (_key, offset, limit) => fetcher(offset, limit), { fallbackData: prefetchedData, revalidateOnMount })

    useEffect(() => {
        window.addEventListener('scroll', onScroll, { passive: true});
    }, []);

    const onScroll = debounce(() => {
        const ascending = window.scrollY > lastY.current;
        const yPosition = window.pageYOffset + window.innerHeight;
        const contentHeight = document.body.offsetHeight;
        
        if (ascending && yPosition > (contentHeight / 2) && !finished.current) {
            setSize(size => size + 1)
        }

        lastY.current = window.scrollY;
    }, 100)

    return (
        <>
        <Stack spacing={2}>
            {
            data.map((page,i) => page.items && 
                                <NftList 
                                    key={i} 
                                    nfts={page.items} 
                                    viewSale={viewSale} 
                                    showTop={showTop}
                                    showAvatar={showAvatar}
                                    showName={showName}
                                />)
            }
        </Stack>
        { !finished.current && isValidating && <HodlLoadingSpinner />}
        </>
    )
}
