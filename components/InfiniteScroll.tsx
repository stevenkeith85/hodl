/* pages/index.js */
import { useEffect, useRef, useState } from 'react'
import { Stack } from '@mui/material'
import NftList from '../components/NftList'
import useSWR from 'swr'
import { useRouter } from 'next/router'


export const InfiniteScroll = ({fetcherFn, viewSale = true, swrKey, showTop=true}) => {
    const router = useRouter();
    const [nfts, _setNfts] = useState([]);
    const nftsRef = useRef(nfts);
    const setNfts = data => {
        nftsRef.current = data(nftsRef.current);
        _setNfts(nftsRef.current);
    };

    const [next, _setNext] = useState(0);
    const nextRef = useRef(next);
    const setNext = data => {
        nextRef.current = data;
        _setNext(data);
    };

    const [prev, _setPrev] = useState(0);
    const prevRef = useRef(prev);
    const setPrev = data => {
        prevRef.current = data;
        _setPrev(data);
    };

    const [offset, _setOffset] = useState(0);
    const setOffset = data => {
        _setOffset(data);
    };

    const [limit, setLimit] = useState(24);

    const [lastScrollY, _setLastScrollY] = useState(0);
    const lastScrollYRef = useRef(lastScrollY);

    const setLastScrollY = data => {
        lastScrollYRef.current = data;
        _setLastScrollY(data);
    };

    const [total, _setTotal] = useState(0);
    const totalRef = useRef(total);
    const setTotal = data => {
        totalRef.current = data;
        _setTotal(data);
    };

    const fetcher = async (swrKey, offset, limit) => {
        const page = await fetcherFn(offset, limit);
        load(page)
    }

    const { data, error } = useSWR([swrKey, offset, limit], fetcher);

    const load = async (data) => {
        if (!data) {
            return;
        }
        const [items, nextOffset, _total] = data;
        
        setNfts(old => {
            const newArray = [
                ...old.slice(0, offset),
                ...items,
                ...old.slice(offset + items.length,),
            ]

            if (newArray.length < 40) { // don't bother truncating if the array isn't that big
                return newArray;
            }

            // truncate

            if (offset === next) { // moving forwards
                const sizeToTruncate = Math.floor(offset / 6);
                return [...Array(sizeToTruncate).fill(({})), ...newArray.slice(sizeToTruncate,)] // fill with null to prevent react adjusting the layout
            } else {
                const indexToTruncateFrom = (offset + limit) + Math.floor(limit / 6); // we can truncate the array here as we don't need the indices and it won't cause a layout shift

                return [...newArray.slice(0, indexToTruncateFrom)]
            }
        });

        if (BigInt(nextOffset) !== BigInt(total)) {
            setNext(nextOffset);
        }

        if (offset - limit >= 0) {
            setPrev(offset - limit);
        }

        setTotal(_total);
    };

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (router.query.address) {
            setNfts(() => []);
        }
        
    }, [router?.query?.address]);

    const onScroll = () => {
        const ascending = window.scrollY > lastScrollYRef.current;
        const yPosition = window.pageYOffset + window.innerHeight;
        const contentHeight = document.body.offsetHeight;
        
        if (nftsRef.current.length &&
            Number(totalRef.current) !== Number(nftsRef.current.length) && // we have all the data
            ascending &&
            yPosition > (contentHeight / 2)) {
            setOffset(Number(nextRef.current));
        }
        else if (nftsRef.current.length &&
            Number(totalRef.current) !== Number(nftsRef.current.length) && // we have all the data
            !ascending &&
            yPosition < (contentHeight / 2)) {
            setOffset(Number(prevRef.current));
        }

        setLastScrollY(window.scrollY);
    }


    return (
        <>
            <Stack spacing={2}>
                {Boolean(nfts.length) &&
                    <NftList nfts={nfts} viewSale={viewSale} showTop={showTop}/>
                }
            </Stack>

        </>
    )
}
