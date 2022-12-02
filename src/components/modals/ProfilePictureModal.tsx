import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { HodlModal } from "./HodlModal";
import axios from 'axios'
import InfiniteScroll from 'react-swr-infinite-scroll'
import useSWR, { mutate } from "swr";
import { useHodling } from "../../hooks/useHodling";
import { AssetThumbnail } from "../AssetThumbnail";
import { useRouter } from "next/router";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { FolderCopyOutlined } from "@mui/icons-material";


export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen, lim = 10 }) => {

    const { address } = useContext(WalletContext);

    const userSWR = useSWR(
        profilePictureModalOpen && address ? [`/api/user`, address] : null,
        (url, address) => axios.get(`${url}/${address}`).then(r => r.data.user)
    )
    const { swr } = useHodling(address, lim, null, profilePictureModalOpen);

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userSWR?.data?.avatar?.id) {
            setToken(userSWR?.data?.avatar?.id);
        }
    }, [userSWR?.data?.avatar?.id])

    if (!profilePictureModalOpen || !swr?.data || !userSWR?.data) {
        return null
    }

    return (
        <>
            <HodlModal
                open={profilePictureModalOpen}
                setOpen={setProfilePictureModalOpen}
                sx={{
                    width: 'auto',
                    maxWidth: '90%'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ marginBottom: 2, fontWeight: 600 }}>Avatar NFT</Typography>

                    {
                        swr.data?.[0]?.items?.length === 0 && <>
                            <Typography sx={{
                                marginBottom: 2,
                                color: theme => theme.palette.text.secondary,
                            }}>Sorry, you aren&apos;t hodling any NFTs at the moment</Typography>
                            <div><Button variant="contained" sx={{ paddingY: 1.5, paddingX: 3, }} onClick={() => router.push('/create')}>Create an NFT</Button></div>
                        </>
                    }
                    {
                        swr.data?.[0]?.items?.length !== 0 && <>
                            <Typography sx={{
                                marginBottom: 2,
                                color: theme => theme.palette.text.secondary,
                            }}>Select an NFT to use as your avatar</Typography>
                            <Box
                                sx={{
                                    width: '350px',
                                    height: '350px',
                                    marginBottom: 2,
                                    overflow: 'auto',
                                    display: 'grid',
                                    gap: 0,
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gridTemplateRows: 'auto'
                                }}>
                                <InfiniteScroll
                                    swr={swr}
                                    isReachingEnd={
                                        swr => {
                                            return swr.data?.[0]?.items?.length === 0 ||
                                                swr.data?.[swr.data?.length - 1]?.items?.length < lim
                                        }
                                    }
                                >
                                    {
                                        ({ items }) => items.map((nft, i) => (
                                            <Box
                                                key={i}
                                                onClick={
                                                    () => {
                                                        setMessage('');
                                                        setToken(nft.id);
                                                    }
                                                }
                                            >
                                                <Box
                                                    sx={{
                                                        lineHeight: 0,
                                                        border: token === nft?.id ?
                                                            theme => `2px solid ${theme.palette.secondary.main}` :
                                                            "2px solid #ddd"
                                                    }}
                                                >

                                                    <AssetThumbnail
                                                        token={nft}
                                                        size={150}
                                                    />

                                                </Box>
                                            </Box>
                                        )
                                        )
                                    }
                                </InfiniteScroll>
                            </Box>
                            <Box sx={{ height: '20px', marginBottom: '16px', color: 'text.secondary' }}>
                                {loading ? <HodlLoadingSpinner />
                                    : message
                                }
                            </Box>
                            <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={4}>
                                <Button
                                    disabled={!token || loading}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        paddingY: 1.5,
                                        paddingX: 3
                                    }}
                                    onClick={async () => {
                                        if (token) {
                                            try {
                                                setLoading(true);
                                                const r = await axios.post(
                                                    '/api/profile/picture',
                                                    { token },
                                                    {
                                                        headers: {
                                                            'Accept': 'application/json',
                                                        },
                                                    }
                                                );
                                                setLoading(false);
                                                setMessage("Avatar successfully updated");
                                            } catch (error) {
                                                setLoading(false);
                                                setMessage("Unable to update avatar at this time");
                                            } finally {
                                                userSWR?.mutate();
                                            }
                                        }
                                    }}
                                >
                                    Select
                                </Button>
                                <Button
                                    disabled={loading}
                                    variant="contained"
                                    color="inherit"
                                    sx={{
                                        paddingY: 1.5,
                                        paddingX: 3
                                    }}
                                    onClick={() => {
                                        setMessage('');
                                        setProfilePictureModalOpen(false);
                                    }}
                                >
                                    Close
                                </Button>
                            </Box>
                        </>}
                </div>
            </HodlModal>
        </>
    )
}
