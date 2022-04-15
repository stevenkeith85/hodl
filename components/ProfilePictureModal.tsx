import { Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from "../pages/_app";
import { HodlButton } from "./HodlButton";
import { HodlModal } from "./HodlModal";
import { InfiniteScroll } from "./InfiniteScroll";
import { RocketTitle } from "./RocketTitle";
import NftList from "./NftList";
import { useConnect } from "../hooks/useConnect";
import { mutate } from "swr";
import { hasExpired } from "../lib/utils";

export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen }) => {
    const [token, setToken] = useState(null);
    const { address } = useContext(WalletContext);
    const [connect] = useConnect();
    
    return (
        <>
            <HodlModal
                open={profilePictureModalOpen}
                setOpen={setProfilePictureModalOpen}
            >
                <Stack spacing={4} >
                    <RocketTitle title="Set Profile NFT" />
                    <Typography>
                        Tired of looking a bit generic? Set a Profile NFT!
                    </Typography>
                    <Typography>
                        You must be Hodling the NFT for it to show up.
                    </Typography>
                    <InfiniteScroll
                        swrkey={'profilePicture: ' + address}
                        fetcher={
                            async (offset, limit) => await fetch(`/api/profile/hodling?address=${address}&offset=${offset}&limit=${limit}`)
                                .then(r => r.json())
                                .then(json => json.data)
                        }
                        revalidateOnMount={true}
                        windowScroll={false}
                        divScrollHeight={ 3 * 100 }
                        lim={10}
                        render={nfts => (
                            <NftList
                                nfts={nfts}
                                viewSale={false}
                                showAvatar={false}
                                showTop={false}
                                showBottom={false}
                                gridColumns={{ xs: "repeat(3, 1fr)" }}
                                imgHeight={100}
                                onClick={(tokenId) => setToken(tokenId)}
                                highlightNft={token}
                            />
                        )}
                    />
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