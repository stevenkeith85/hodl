import { AccountCircle, ChevronLeftOutlined, DisplaySettingsOutlined, CameraAltOutlined, PersonOffOutlined, Person, PersonOutlined } from "@mui/icons-material";
import { Typography, Box, Stack, Link, ClickAwayListener, useMediaQuery, useTheme, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useNickname } from "../../hooks/useNickname";
import { WalletContext } from '../../contexts/WalletContext';
import { NicknameModal } from "../modals/NicknameModal";
import { ProfilePictureModal } from "../modals/ProfilePictureModal";
import { LoginLogoutButton } from "./LoginLogoutButton";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";

export const WalletMenuPage = ({ setHoverMenuOpen, hoverMenuOpen, setMenuPage, menuPage }) => {
    const router = useRouter();
    const [_update, _apiError, _setApiError, nickname] = useNickname();
    const { address } = useContext(WalletContext);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const [walletPages] = useState([
        { label: 'Nickname', action: () => setNicknameModalOpen(true), icon: <DisplaySettingsOutlined /> },
        { label: 'Avatar', action: () => setProfilePictureModalOpen(true), icon: <CameraAltOutlined /> },
    ]);

    const handleRouteChange = () => {
        if (hoverMenuOpen) {
            setHoverMenuOpen(false)
        }
    }

    useEffect(() => {
        console.log('wallet menu route change')
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        };

    }, [router.events]);


    return (
        <ClickAwayListener
            onClickAway={e => {
                e.stopPropagation();
                if (hoverMenuOpen) {
                    setHoverMenuOpen(false)
                }

            }} touchEvent={false}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%'
            }}>
                <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>
                <ProfilePictureModal profilePictureModalOpen={profilePictureModalOpen} setProfilePictureModalOpen={setProfilePictureModalOpen}></ProfilePictureModal>
                <Box sx={{
                    flexGrow: 1,
                    flexShrink: 0,
                    flexBasis: 'auto',
                }}>
                    {matches && <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                            color: '#666',
                            '&:hover': {
                                cursor: 'pointer',
                                color: theme => theme.palette.secondary.main,
                            },
                            borderBottom: '1px solid #f0f0f0',
                            paddingBottom: 2,
                            marginBottom: 2
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            setMenuPage(0)
                        }}
                    >
                        <Box
                            flexGrow="1"
                            display="flex"
                            alignItems="center">
                            <AccountCircle />
                            <Typography
                                component="a"
                                sx={{
                                    textDecoration: 'none',
                                    marginLeft: 1,
                                }} >
                                Account
                            </Typography>
                        </Box>
                        <ChevronLeftOutlined />
                    </Box>}
                    {
                        address &&
                        <Stack spacing={0} m={0} >
                            <Stack
                                key={'avatar'}
                                direction="row"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onClick={e => {
                                    e.stopPropagation();
                                    router.push(`/profile/${nickname || address}`)
                                }}
                            >
                                <Button
                                    color="inherit"
                                    startIcon={<PersonOutlined />}
                                    variant="text"
                                    fullWidth={true}
                                    sx={{
                                        justifyContent: "flex-start",
                                        paddingX: 2,
                                        paddingY: 1.5
                                    }}>
                                    Profile
                                </Button>
                            </Stack>
                            {walletPages.map((page, i) => (
                                <Box
                                    key={i}
                                    display="flex"
                                    flexDirection="column"

                                    onClick={e => {
                                        e.stopPropagation();
                                        page.action();
                                    }}
                                >
                                    <Button
                                        color="inherit"
                                        fullWidth={true}
                                        variant="text"
                                        startIcon={page.icon}
                                        sx={{
                                            justifyContent: "flex-start",
                                            paddingX: 2,
                                            paddingY: 1.5
                                        }}
                                    >
                                        {page.label}
                                    </Button>
                                </Box>
                            ))}
                        </Stack>
                    }
                    {
                        !address &&
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                        >
                            <Typography variant="h1">Connect</Typography>
                            <Typography>Your wallet to get started</Typography>
                            <Typography>We officially support <Link href="https://metamask.io/download/">MetaMask</Link></Typography>
                            <Box>
                                <LoginLogoutButton
                                    sx={{
                                        justifyContent: "flex-start",
                                        paddingY: 1,
                                        paddingX: 2
                                    }} />
                            </Box>
                        </Box>
                    }
                </Box>
                { address && <LoginLogoutButton
                    variant="text"
                    sx={{
                        paddingX: 2,
                        paddingY: 1.5,
                        justifyContent: "flex-start",
                    }} />}
            </Box>
        </ClickAwayListener>
    )
}
