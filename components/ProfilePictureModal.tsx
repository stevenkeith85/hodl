import { Button, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from '../contexts/WalletContext';
import { HodlModal } from "./HodlModal";
import { RocketTitle } from "./RocketTitle";
import NftList from "./NftList";
import { useConnect } from "../hooks/useConnect";
import { mutate } from "swr";
import { hasExpired } from "../lib/utils";

import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "./HodlLoadingSpinner";
import SelectProfileNFT from "./SelectProfileNFT";


export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen, lim = 10 }) => {
    const [token, setToken] = useState(null);
    const { address } = useContext(WalletContext);
    const [connect] = useConnect();


    const getKey = (index, previous) => {
        return [`/api/profile/hodling?address=${address}`, index * lim, lim];
    }

    const fetcher = async (key, offset, limit) => await fetch(`/api/profile/hodling?address=${address}&offset=${offset}&limit=${limit}`)
        .then(r => r.json())

    const swr = useSWRInfinite(getKey, fetcher, {
        dedupingInterval: 10000
    });

    if (!swr.data) {
        return null;
      }


      console.log(swr)
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
                    <InfiniteScroll
                        swr={swr}
                        loadingIndicator={<HodlLoadingSpinner />}
                        isReachingEnd={swr => swr.data?.[0]?.items.length === 0 || swr.data?.[swr.data?.length - 1]?.items.length < lim}
                    >
                        {
                            ({ items }) => 
                                <SelectProfileNFT
                                    nfts={items}
                                    onClick={(tokenId) => setToken(tokenId)}
                                />
                        }
                    </InfiniteScroll>
                    <Button
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
                        Select
                    </Button>
                </Stack>
            </HodlModal>
        </>
    )
}