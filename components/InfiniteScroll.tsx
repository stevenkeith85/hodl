import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite'
import { debounce } from '../lib/utils';
import { HodlLoadingSpinner } from './HodlLoadingSpinner';

export const InfiniteScroll = ({ 
    swrkey, 
    fetcher, 
    prefetchedData=null, 
    revalidateOnMount=true, 
    windowScroll=true,
    divScrollHeight=300,
    lim=20,
    render
}) => {
    const limit = useRef(lim);
    const lastY = useRef(0);

    const finished = useRef<boolean>();
    const [complete, setComplete] =  useState(false);

    const getKey = (index, previousData) => {
        if (previousData && previousData?.next === previousData?.total) {
            finished.current = true;
            setComplete(true);
            return null 
        }
        return [swrkey, index * limit.current, limit.current]
      }

    const { data, error, size, setSize } = useSWRInfinite(getKey, (_key, offset, limit) => fetcher(offset, limit), { fallbackData: prefetchedData, revalidateOnMount })

    useEffect(() => {
        if (windowScroll) {
            window.addEventListener('scroll', onScroll, { passive: true});
        }
    }, []);

    const isLoadingMore = (!data && !error) || (size > 0 && data && typeof data[size-1] === "undefined");

    const onScroll = debounce(() => {
        const ascending = window.scrollY > lastY.current;
        const yPosition = window.pageYOffset + window.innerHeight;
        const contentHeight = document.body.offsetHeight;

        if (ascending && yPosition > (contentHeight / 2) && !finished.current) {
            setSize(size => size + 1)
        }

        lastY.current = window.scrollY;
    }, 500, false)

    const onDivScroll = debounce((e) => {
        const el = e.target;
        const ascending = el.scrollTop > lastY.current;
        if (ascending && (el.scrollTop > 
            ((el.scrollHeight - el.clientHeight) / 2))) {
                setSize(size => size + 1)
        }

        lastY.current = el.scrollTop;
    }, 50, false);

    return (
        <Box onScroll={!windowScroll ? onDivScroll : undefined} sx={{ height: windowScroll ? 'auto': divScrollHeight, overflow: 'auto', marginBottom: 2}}>
            { data?.map(page => render(page?.items)) } 
            { !complete && isLoadingMore && <HodlLoadingSpinner />}
        </Box>
    )
}
