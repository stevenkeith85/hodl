import { AccountBalanceWallet } from "@mui/icons-material";
import { Tooltip, Typography, Box, Stack, Button } from "@mui/material";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { useConnect } from "../../hooks/useConnect";
import { useNickname } from "../../hooks/useNickname";
import { truncateText, getShortAddress } from "../../lib/utils";
import { WalletContext } from '../../contexts/WalletContext';
import { SearchBox } from "../Search";


export const MainMenuPage = ({
    pages,
    closeMenu,
    router,
    setMenuPage
}) => {
    const [_update, _apiError, _setApiError, nickname] = useNickname();
    const { signer, address } = useContext(WalletContext);
    const [connect] = useConnect();

    const buttonText = () => {
        if (nickname) {
            return <Tooltip title={nickname}><Typography>{truncateText(nickname, 20)}</Typography></Tooltip>
        } else if (address) {
            return <Tooltip title={address}><Typography>{getShortAddress(address).toLowerCase()}</Typography></Tooltip>
        } else {
            return 'Connect';
        }
    }

    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }

    const connectMobile = () => {
        router.push("https://metamask.app.link/dapp/192.168.1.242:3001/");
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <Box sx={{
                flexGrow: 1,
            }}>
                <Stack
                    spacing={0}
                    m={0}
                >
                    {pages.filter(p => p.publicPage || address).map((page, i) => (
                        <Link key={i} href={page.url} passHref>
                            <Stack
                                direction="row"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        color: theme => theme.palette.secondary.main,
                                    }
                                }}>
                                {page.icon}
                                <Typography
                                    component="a"
                                    //  onClick={closeMenu}
                                    sx={{
                                        fontSize: 14,
                                        textDecoration: 'none',
                                        fontWeight: (theme) => router.asPath === page.url ? 900 : 300,
                                        padding: 1,
                                    }} >
                                    {page.label}
                                </Typography>
                            </Stack>
                        </Link>

                    ))}

                    <SearchBox closeMenu={closeMenu} sx={{ marginY: 1 }} />

                </Stack>
            </Box>
            <Button
                color="secondary"
                onClick={(e) => {
                    e.stopPropagation();
                    if (signer) {
                        setMenuPage(1);
                    } else if (isMobileDevice()) {
                        connectMobile();
                    }
                    else {
                        connect(false);
                    }
                }
                }
                sx={{
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto',
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <AccountBalanceWallet />
                    <Typography sx={{
                        fontSize: 16
                    }}>
                        {buttonText()}
                    </Typography>
                </Stack>
            </Button>
        </Box>
    )
}
