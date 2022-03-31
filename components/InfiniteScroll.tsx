/* pages/index.js */
import { useEffect, useRef, useState } from 'react'
import { Stack } from '@mui/material'
import NftList from '../components/NftList'
import useSWR from 'swr'
import Head from 'next/head'
import memoize from 'memoizee';
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

            if (newArray.length < 50) { // don't bother truncating if the array isn't that big
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

        if (nftsRef.current.length &&
            Number(totalRef.current) !== Number(nftsRef.current.length) && // we have all the data
            ascending &&
            (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 1300)) {

            setOffset(Number(nextRef.current));
        }
        else if (nftsRef.current.length &&
            Number(totalRef.current) !== Number(nftsRef.current.length) && // we have all the data
            !ascending &&
            window.pageYOffset < 1300) {
            setOffset(Number(prevRef.current));
        }

        setLastScrollY(window.scrollY);
    }

    // This is based on
    // "(max-width:599px) 100vw, (max-width:899px) 50vw, (max-width:1199px) 33vw, 25vw"
    const calcImageWidthWeNeed = memoize(() => {
        const findFindSizeBigEnough = (width) => {
            const sizes = [400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1350, 1500, 1700];

            for (let i = 0; i < sizes.length; i++ ) {
                if (width > sizes[i]) {
                    continue;
                }
                return sizes[i];
            }
        }
        
        const vw = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio;

        let imageWidth;

        if (vw < 600) {
            imageWidth = vw * devicePixelRatio;
        } else if (vw < 900) {
            imageWidth = (vw / 2) * devicePixelRatio;
        } else if (vw < 1200){
            imageWidth = (vw / 3) * devicePixelRatio;
        } else {
            imageWidth = (vw / 4) * devicePixelRatio;
        }
        return findFindSizeBigEnough(imageWidth);
    });

    return (
        <>
            <Head>
                {
                    nfts.map((nft,i) => {
                        if (!nft) { return null; }
                        return (
                            <>
                                <link key={'blurred' + i} rel="preload" href={`https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,h_350,q_10/e_grayscale/nfts/${nft.image}`} />
                                <link key={'actual' + i} rel="preload" href={`https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${calcImageWidthWeNeed()},q_auto/nfts/${nft.image}`} />
                            </>
                        )

                    })
                }
            </Head>

            <Stack spacing={2}>
                {Boolean(nfts.length) &&
                    <NftList nfts={nfts} viewSale={viewSale} showTop={showTop}/>
                }
            </Stack>

        </>
    )
}
