import DisplaySettingsOutlinedIcon from '@mui/icons-material/DisplaySettingsOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNickname } from "../../hooks/useNickname";
import { WalletContext } from '../../contexts/WalletContext';
import { NicknameModal } from "../modals/NicknameModal";
import { ProfilePictureModal } from "../modals/ProfilePictureModal";
import { LoginLogoutButton } from "./LoginLogoutButton";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
import MetaMaskOnboarding from '@metamask/onboarding'


interface WalletMenuPageProps {
    hoverMenuOpen: boolean;
    setHoverMenuOpen: Function;
}

export const WalletMenuPage: React.FC<WalletMenuPageProps> = ({
    setHoverMenuOpen,
    hoverMenuOpen,
}) => {
    const router = useRouter();
    const [_update, _apiError, _setApiError, nickname] = useNickname();
    const { address } = useContext(WalletContext);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);

    const [walletPages] = useState([
        { label: 'nickname', action: () => setNicknameModalOpen(true), icon: <DisplaySettingsOutlinedIcon /> },
        { label: 'avatar', action: () => setProfilePictureModalOpen(true), icon: <CameraAltOutlinedIcon /> },
        { label: 'transactions', action: () => router.push('/transactions'), icon: <ReceiptOutlinedIcon /> },
    ]);

    const handleRouteChange = useCallback(() => {
        if (hoverMenuOpen) {
            setHoverMenuOpen(false)
        }
    }, [hoverMenuOpen, setHoverMenuOpen]);

    useEffect(() => {
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        };

    }, [router.events, handleRouteChange]);

    const onboarding = useRef<MetaMaskOnboarding>();

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

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
                // flexGrow: 1,
                // height: '100%'
            }}>
                <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>
                <ProfilePictureModal profilePictureModalOpen={profilePictureModalOpen} setProfilePictureModalOpen={setProfilePictureModalOpen}></ProfilePictureModal>
                <Box sx={{
                    flexGrow: 1,
                    flexShrink: 0,
                    flexBasis: 'auto',
                }}>
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
                                    color="primary"
                                    startIcon={<PersonOutlinedIcon />}
                                    variant="text"
                                    fullWidth={true}
                                    sx={{
                                        justifyContent: "flex-start",
                                        paddingX: 2,
                                        paddingY: 1.5
                                    }}>
                                    <ProfileNameOrAddress profileAddress={address} color="primary" />
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
                                        color="primary"
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
                        !address && <>

                            <Box
                                display="flex"
                                flexDirection="column"
                            >
                                <Typography mb={2} sx={{ fontSize: 18 }}>Sign in</Typography>

                                <Typography mb={2} sx={{ fontSize: 16, color: theme => theme.palette.text.secondary }}>
                                    Your wallet is your digital identity. We use it to sign you in.
                                </Typography>
                                <Typography mb={2} sx={{ fontSize: 14, color: theme => theme.palette.text.secondary }}>
                                    <Link target="_blank" href="/learn/connecting-a-wallet">Read more</Link>
                                </Typography>
                                {
                                    !(MetaMaskOnboarding.isMetaMaskInstalled()) &&
                                    <Typography mb={2} component="a" onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onboarding.current.startOnboarding()
                                    }}>
                                        <Link href="#">Install metamask</Link>
                                    </Typography>

                                }
                                <div>
                                    <LoginLogoutButton
                                        variant='contained'
                                        closeMenu={() => setHoverMenuOpen(false)}
                                        sx={{
                                            fontSize: 16,
                                            paddingY: 0.75,
                                            paddingX: 3,
                                        }} />
                                </div>
                            </Box>
                        </>
                    }
                </Box>
                {address &&
                    <Box margin={1.5}>
                        <LoginLogoutButton
                            variant='outlined'
                            sx={{
                                paddingY: 0.75,
                                paddingX: 3,
                            }}
                        />
                    </Box>
                }
            </Box>
        </ClickAwayListener >
    )
}
