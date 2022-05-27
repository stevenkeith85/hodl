import { DisplaySettings, CameraAlt, AccountCircle, ArrowLeftOutlined, ChevronLeftOutlined, Person, DisplaySettingsOutlined, CameraAltOutlined } from "@mui/icons-material";
import { Typography, Box, Stack, Link, ClickAwayListener, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useNickname } from "../../hooks/useNickname";
import { WalletContext } from '../../contexts/WalletContext';
import { NicknameModal } from "../modals/NicknameModal";
import { ProfilePictureModal } from "../ProfilePictureModal";
import { LoginLogoutButton } from "./LoginLogoutButton";
import { ProfileAvatar } from "../ProfileAvatar";

export const WalletMenuPage = ({ setHoverMenuOpen, hoverMenuOpen, setMenuPage, menuPage }) => {
    const router = useRouter();
    const [_update, _apiError, _setApiError, nickname] = useNickname();
    const { address } = useContext(WalletContext);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const [walletPages] = useState([
        {
            label: '', action: () => {
                router.push(`/profile/${nickname || address}`);
            }, icon: <ProfileAvatar profileAddress={address} size="small" showNickname={true} withLink={false} />
        },
        { label: 'Nickname', action: () => setNicknameModalOpen(true), icon: <DisplaySettingsOutlined /> },
        { label: 'Avatar', action: () => setProfilePictureModalOpen(true), icon: <CameraAltOutlined /> },
    ]);

    const handleRouteChange = () => {
        if (hoverMenuOpen) {
            setHoverMenuOpen(false)
        }
    }

    useEffect(() => {
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
          router.events.off('routeChangeComplete', handleRouteChange)
        };
            
      }, [router.events]);
      
    return (
        <ClickAwayListener onClickAway={(e) => {
            e.stopPropagation();
            setHoverMenuOpen(false)
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
                            e.stopPropagation(); // TODO: For some reason the click away listener is calling onClickAway whenever we click on a menu item. working around by stopping propagation at the moment
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
                            {walletPages.map((page, i) => (
                                <Stack
                                    key={i}
                                    direction="row"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
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
                                        page.action();
                                    }}
                                >
                                    {page.icon}
                                    <Typography
                                        component="a"
                                        sx={{
                                            // fontSize: 14,
                                            textDecoration: 'none',
                                            marginLeft: 2,

                                        }} >
                                        {page.label}
                                    </Typography>

                                </Stack>
                            ))}
                        </Stack>
                    }
                    {
                        !address &&
                        <Box mb={4}>
                            <Typography mb={2} variant="h1">Sign In</Typography>
                            <Typography mb={2} >Connect your wallet to access your account.</Typography>
                            <Typography>We officially support <Link href="https://metamask.io/download/">MetaMask</Link></Typography>

                        </Box>
                    }
                </Box>
                <LoginLogoutButton />
            </Box>
        </ClickAwayListener>
    )
}
