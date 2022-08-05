import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { HodlModal } from "./HodlModal";
import axios from 'axios'
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import SelectProfileNFT from "../SelectProfileNFT";
import useSWR, { mutate } from "swr";
import { useHodling } from "../../hooks/useHodling";


export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen, lim = 10 }) => {

    const { address } = useContext(WalletContext);

    const { data: tokenId } = useSWR(
        profilePictureModalOpen && address ? [`/api/profile/picture`, address] : null,
        (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.token)
    )

    const {swr} = useHodling(address, lim, null, profilePictureModalOpen);

    const [token, setToken] = useState(tokenId);

    if (!profilePictureModalOpen) {
        return null
    }

    return (
        <>
            <HodlModal
                open={profilePictureModalOpen}
                setOpen={setProfilePictureModalOpen}
            >
                <Stack spacing={3} textAlign="center">
                    <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Avatar</Typography>
                    <Typography sx={{ fontSize: '18px', color: '#999' }}>Select an NFT to use as your profile avatar</Typography>

                    <InfiniteScroll
                        swr={swr}
                        loadingIndicator={<HodlLoadingSpinner />}
                        isReachingEnd={
                            swr => {
                                return swr.data?.[0]?.items?.length == 0 || 
                                        swr.data?.[swr.data?.length - 1]?.items?.length < lim
                              }
                        }
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
                    <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                paddingY: 1.5,
                                paddingX: 3
                            }}
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
                                                },
                                            }
                                        );

                                        mutate([`/api/user`, address])
                                        setProfilePictureModalOpen(false);

                                    } catch (error) {
                                    }
                                }
                            }}
                        >
                            Select
                        </Button>
                        <Button
                            variant="contained"
                            color="inherit"
                            sx={{
                                paddingY: 1.5,
                                paddingX: 3
                            }}
                            onClick={() => {
                                setProfilePictureModalOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Stack>
            </HodlModal>
        </>
    )
}