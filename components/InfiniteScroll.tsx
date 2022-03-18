/* pages/index.js */
import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Stack } from '@mui/material'
import NftList from '../components/NftList'
import useSWR from 'swr'
import Head from 'next/head'


export const InfiniteScroll = ({fetcherFn, viewSale = true, swrKey}) => {
    
    const [loading, setLoading] = useState(false);

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

    const [limit, setLimit] = useState(16);

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
        setLoading(true);
        const page = await fetcherFn(offset, limit);
        console.log(page)
        load(page)
        setLoading(false);
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

            if (newArray.length < 50) { // don't bother truncating if the array isn't that big
                return newArray;
            }

            console.log("Array is over 50", newArray.length)

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

    const onScroll = () => {
        const ascending = window.scrollY > lastScrollYRef.current;

        if (nftsRef.current.length &&
            //Number(totalRef.current) !== Number(nftsRef.current.length) && // we have all the data
            ascending &&
            (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 700)) {

            setOffset(nextRef.current);
        }
        else if (nftsRef.current.length &&
            !ascending &&
            window.pageYOffset < 700) {
            setOffset(prevRef.current);
        }

        setLastScrollY(window.scrollY);
    }

    if (loading) {
        return (
            <Box sx={{ marginTop: "20vh", display: 'flex', justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    return (
        <>
            <Head>
                {nfts.map(nft => {
                    if (!nft) { return null; }
                    const link = `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_550,q_75/nfts/${nft.image}`;

                    return (<link key={link} rel="preload" as="image" href={link} />)
                })
                }
            </Head>

            <Stack spacing={2}>
                {Boolean(nfts.length) &&
                    <NftList nfts={nfts} viewSale={viewSale} />
                }
            </Stack>

        </>
    )
}
