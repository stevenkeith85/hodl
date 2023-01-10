import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import axios from 'axios'
import InfiniteScroll from 'react-swr-infinite-scroll'
import useSWR from "swr";
import { useHodling } from "../../hooks/useHodling";
import { AssetThumbnail } from "../AssetThumbnail";
import { useRouter } from "next/router";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { SignedInContext } from "../../contexts/SignedInContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import { useListed } from "../../hooks/useListed";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const AvatarSelector = ({ swr, setMessage, setToken, token, lim }) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 0,
                gridTemplateColumns: '1fr 1fr 1fr',
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
                                    border: token === nft?.id ? theme => `2px solid ${theme.palette.secondary.main}` : "2px solid #ddd"
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
    )
}

export const ProfilePictureModal = ({ profilePictureModalOpen, setProfilePictureModalOpen, lim = 10 }) => {

    const { signedInAddress: address } = useContext(SignedInContext);

    const userSWR = useSWR(
        profilePictureModalOpen && address ? [`/api/user`, address] : null,
        (url, address) => axios.get(`${url}/${address}`).then(r => r.data.user)
    )
    const { swr: hodlingSwr } = useHodling(address, lim, null, profilePictureModalOpen);
    const { swr: listedSwr } = useListed(address, lim, null, profilePictureModalOpen);

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [message, setMessage] = useState('');

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    useEffect(() => {
        if (userSWR?.data?.avatar?.id) {
            setToken(userSWR?.data?.avatar?.id);
        }
    }, [userSWR?.data?.avatar?.id])

    if (!profilePictureModalOpen || !hodlingSwr?.data || !userSWR?.data) {
        return null
    }

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                maxWidth="sm"
                fullWidth
                open={profilePictureModalOpen}
                onClose={(e) => {
                    // @ts-ignore
                    e.stopPropagation();

                    // @ts-ignore
                    e.preventDefault();

                    setProfilePictureModalOpen(false);
                }}
            >
                <DialogTitle>Avatar NFT</DialogTitle>
                <DialogContent
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    {
                        hodlingSwr.data?.[0]?.items?.length === 0 && listedSwr.data?.[0]?.items?.length === 0 &&
                        <>
                            <Typography
                                sx={{
                                    color: theme => theme.palette.text.secondary,
                                }}>You aren&apos;t hodling any NFTs at the moment</Typography>
                            <div>
                                <Button variant="contained" sx={{ paddingY: 1, paddingX: 2, }} onClick={() => router.push('/create')}>Create an NFT</Button>
                            </div>
                        </>
                    }
                    {
                       ( hodlingSwr.data?.[0]?.items?.length !== 0 || listedSwr.data?.[0]?.items?.length === 0) &&
                        <>
                            <Box
                                sx={{
                                    flex: 0
                                }}>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                    }}>
                                    Select an NFT to use as your avatar
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 0,
                                }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                >
                                    <Tab label="Hodling"></Tab>
                                    <Tab label="Listed"></Tab>
                                </Tabs>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 1,
                                    overflow: 'auto',
                                }}>
                                <div
                                    hidden={value !== 0}>
                                    <AvatarSelector swr={hodlingSwr} setMessage={setMessage} setToken={setToken} token={token} lim={lim} />
                                </div>
                                <div
                                    hidden={value !== 1}>
                                    <AvatarSelector swr={listedSwr} setMessage={setMessage} setToken={setToken} token={token} lim={lim} />
                                </div>
                            </Box>

                            <Box
                                sx={{
                                    flex: 0,
                                    color: 'text.secondary'
                                }}>
                                {
                                    loading ? <HodlLoadingSpinner /> : message
                                }
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: 0,
                                    justifyContent: 'flex-end'
                                }}>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 4
                                    }}
                                >
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
                            </Box>

                        </>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}
