import { Button, Stack } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from '../contexts/WalletContext';
import { HodlModal } from "./HodlModal";
import { RocketTitle } from "./RocketTitle";
import axios from 'axios'
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "./HodlLoadingSpinner";
import SelectProfileNFT from "./SelectProfileNFT";
import { mutate } from "swr";


export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen, lim = 10 }) => {
    const [token, setToken] = useState(null);
    const { address } = useContext(WalletContext);

    const getKey = (index, previous) => {
        return address ? [`/api/profile/hodling?address=${address}`, index * lim, lim]: null;
    }

    const fetcher = async (key, offset, limit) => await axios.get(`/api/profile/hodling?address=${address}&offset=${offset}&limit=${limit}`)
        .then(r => r.data)

    const swr = useSWRInfinite(getKey, fetcher, {
        dedupingInterval: 10000
    });

    if (!swr.data) {
        return null;
    }

    if (swr?.error) {
        return null;
    }

    if (!profilePictureModalOpen) {
        return null
    }

    return (
        <>
            <HodlModal
                open={profilePictureModalOpen}
                setOpen={setProfilePictureModalOpen}
            >
                <Stack spacing={2} >
                    <RocketTitle title="Avatar" />
                    <InfiniteScroll
                        swr={swr}
                        loadingIndicator={<HodlLoadingSpinner />}
                        isReachingEnd={swr => swr.data?.[0]?.items.length === 0 || swr.data?.[swr.data?.length - 1]?.items.length < lim}
                    >
                        {
                            ({ items }) =>
                                <SelectProfileNFT
                                    selectedTokenId={token}
                                    nfts={items}
                                    onClick={(tokenId) => setToken(tokenId)}
                                />
                        }
                    </InfiniteScroll>
                    <Button
                        disabled={!token}
                        onClick={async () => {
                            if (token) {
                                try {
                                    const r = await axios.post(
                                        '/api/profile/picture',
                                        { token },
                                        {
                                            headers: {
                                                'Accept': 'application/json',
                                                'Authorization': localStorage.getItem('jwt')
                                            },
                                        }
                                    );

                                    mutate([`/api/profile/picture`, address])
                                    setProfilePictureModalOpen(false);

                                } catch (error) {
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