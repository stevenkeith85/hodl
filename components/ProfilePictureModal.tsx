import { Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from "../pages/_app";
import { HodlButton } from "./HodlButton";
import { HodlModal } from "./HodlModal";
// import { InfiniteScroll } from "./InfiniteScroll";
import { RocketTitle } from "./RocketTitle";
import NftList from "./NftList";
import { useConnect } from "../hooks/useConnect";
import { mutate } from "swr";
import { hasExpired } from "../lib/utils";

import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "./HodlLoadingSpinner";


export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen, lim = 10 }) => {
    const [token, setToken] = useState(null);
    const { address } = useContext(WalletContext);
    const [connect] = useConnect();


    const getKey = (index, previous) => {
        return [`/api/profile/hodling?address=${address}`, index * lim, lim];
    }

    const fetcher = async (key, offset, limit) => await fetch(`/api/profile/hodling?address=${address}&offset=${offset}&limit=${limit}`)
        .then(r => r.json())
        .then(json => json.data);

    const swr = useSWRInfinite(getKey, fetcher, {
        dedupingInterval: 10000
    });


    if (swr?.error) {
        console.log('swr infinite error', swr.error)
        return null;
      }

    return (
        <>
            <HodlModal
                open={profilePictureModalOpen}
                setOpen={setProfilePictureModalOpen}
            >
                <Stack spacing={2} >
                    <RocketTitle title="Set Profile NFT" />
                    <Typography>Tired of looking a bit generic?</Typography>
                    <Typography>Set a profile NFT instead</Typography>
                    <InfiniteScroll
                        swr={swr}
                        loadingIndicator={<HodlLoadingSpinner />}
                        isReachingEnd={swr => swr.data?.[0]?.items.length === 0 || swr.data?.[swr.data?.length - 1]?.items.length < lim}
                    >
                        {
                            ({ items }) =>
                                <NftList
                                    nfts={items}
                                    viewSale={false}
                                    showAvatar={false}
                                    showTop={false}
                                    showBottom={false}
                                    gridColumns={{ xs: "repeat(3, 1fr)" }}
                                    imgHeight={100}
                                    onClick={(tokenId) => setToken(tokenId)}
                                    highlightNft={token}
                                />
                        }
                    </InfiniteScroll>
                    <HodlButton
                        disabled={!token}
                        onClick={async () => {
                            if (token) {
                                if (hasExpired(localStorage.getItem('jwt'))) {
                                    await connect(true, true);
                                }

                                const r = await fetch('/api/profile/picture', {
                                    method: 'POST',
                                    headers: new Headers({
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': localStorage.getItem('jwt')
                                    }),
                                    body: JSON.stringify({ token }),
                                });

                                if (r.status === 200) {
                                    mutate([`/api/profile/picture`, address])
                                    setProfilePictureModalOpen(false);
                                } else if (r.status === 403) {
                                    connect()
                                }
                            }
                        }}
                    >
                        Set Profile NFT
                    </HodlButton>
                </Stack>
            </HodlModal>
        </>
    )
}