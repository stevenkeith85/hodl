import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { HodlModal } from "./HodlModal";
import axios from 'axios'
import InfiniteScroll from 'react-swr-infinite-scroll'
import useSWR, { mutate } from "swr";
import { useHodling } from "../../hooks/useHodling";
import { AssetThumbnail } from "../AssetThumbnail";


export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen, lim = 10 }) => {

    const { address } = useContext(WalletContext);

    const { data: user } = useSWR(
        profilePictureModalOpen && address ? [`/api/user`, address] : null,
        (url, address) => axios.get(`${url}/${address}`).then(r => r.data.user)
    )
    const { swr } = useHodling(address, lim, null, profilePictureModalOpen);

    const [token, setToken] = useState(null);

    useEffect(() => {

        if(user?.avatar?.id) {
            setToken(user?.avatar?.id);
        }
    }, [user?.avatar?.id])

    if (!profilePictureModalOpen) {
        return null
    }

    return (
        <>
            <HodlModal
                open={profilePictureModalOpen}
                setOpen={setProfilePictureModalOpen}
                sx={{
                    width: '450px',
                    maxWidth: '90%'
                }}
            >
                <Stack spacing={3} textAlign="center">
                    <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600 }}>Avatar</Typography>
                    <Typography sx={{
                        fontSize: '18px',
                        color: theme => theme.palette.text.secondary,
                    }}>Select an NFT to use as your profile avatar</Typography>
                    <Box
                        sx={{
                            maxHeight: '80vh',
                            overflow: 'auto',
                            display: 'grid',
                            gap: 1,
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gridTemplateRows: 'auto'
                        }}>
                            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                        <InfiniteScroll
                            swr={swr}
                            isReachingEnd={
                                swr => {
                                    return swr.data?.[0]?.items?.length == 0 ||
                                        swr.data?.[swr.data?.length - 1]?.items?.length < lim
                                }
                            }
                        >
                            {
                                ({ items }) => items.map((nft, i) => (
                                    <Box
                                        key={i}
                                        onClick={
                                            () => setToken(nft.id)
                                        }
                                    >
                                        <Box
                                            sx={{
                                                lineHeight: 0,
                                                border: token === nft?.id ?
                                                    theme => `2px solid ${theme.palette.secondary.main}` :
                                                    "2px solid transparent"
                                            }}
                                        >
                                            <AssetThumbnail token={nft} size={150} />
                                        </Box>
                                    </Box>
                                )
                                )
                            }
                        </InfiniteScroll>
                    </Box>
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
