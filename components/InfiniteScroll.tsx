/* pages/index.js */
import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Stack } from '@mui/material'
import NftList from '../components/NftList'
import useSWR from 'swr'
import Head from 'next/head'


export const InfiniteScroll = ({fetcherFn, viewSale = true, swrKey}) => {
    console.log('here')
    const [nfts, _setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [next, _setNext] = useState(0);
    const [prev, _setPrev] = useState(0);

    const nextRef = useRef(next);
    const setNext = data => {
        nextRef.current = data;
        _setNext(data);
    };
    
    const prevRef = useRef(prev);
    const setPrev = data => {
        prevRef.current = data;
        _setPrev(data);
    };

    const [offset, _setOffset] = useState(0);
    const [limit, setLimit] = useState(20);

    const fetcher = (swrKey, offset, limit) => fetcherFn(offset, limit);
    const { data, error } = useSWR([swrKey, offset, limit], fetcher);

    const nftsRef = useRef(nfts);
    const setNfts = data => {
        nftsRef.current = data(nftsRef.current);
        _setNfts(nftsRef.current);
    };

    const [lastScrollY, _setLastScrollY] = useState(0);
    const lastScrollYRef = useRef(lastScrollY);
    const setLastScrollY = data => {
        lastScrollYRef.current = data;
        _setLastScrollY(data);
    };

    const setOffset = data => {
        _setOffset(data);
    };

    const load = async () => {
        if (!data) {
            return;
        }

        const [items, nextOffset, total] = data;

        setNfts(old => {

            const newArray = [
                ...old.slice(0, offset),
                ...items,
                ...old.slice(offset + items.length,),
            ]

            if (offset === next) { // moving forwards  
                const sizeToTruncate = Math.floor(offset / 6);
                return [...Array(sizeToTruncate).fill(({})), ...newArray.slice(sizeToTruncate,)] // we use the indices so fill with null
            } else {
                const indexToTruncateFrom = (offset + limit) + Math.floor(limit / 6); // we can truncate the array here at we don't need the indices

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
        window.addEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        load();
    }, [data]);

        
    const onScroll = () => {
        const ascending = window.scrollY > lastScrollYRef.current;

        if (nftsRef.current.length && 
            ascending && 
            (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 650)) {
            setOffset(nextRef.current);
        }
        else if (nftsRef.current.length && 
            !ascending && 
            window.pageYOffset < 650) {

                console.log(window.pageYOffset);
                console.log(window.scrollY);
                console.log(document.body.offsetHeight);
            
            setOffset(prevRef.current);
        }

        setLastScrollY(window.scrollY);
    }

    if (loading) {
        return (
            <Box sx={{ marginTop: "40vh", display: 'flex', justifyContent: "center", alignItems: "center", alignContent: "center" }}>
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
                {Boolean(!loading) &&
                    <NftList nfts={nfts} viewSale={viewSale} />
                }
            </Stack>

        </>
    )
}
