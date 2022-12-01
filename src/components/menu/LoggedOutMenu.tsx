import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { useEffect, useRef } from "react";
import { LoginLogoutButton } from "./LoginLogoutButton";
import MetaMaskOnboarding from '@metamask/onboarding'


export const LoggedOutMenu = ({setHoverMenuOpen}) => {
    const onboarding = useRef<MetaMaskOnboarding>();

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
        >
            <Typography mb={2} sx={{ fontSize: 18 }}>Sign in</Typography>

            <Typography mb={2} sx={{ fontSize: 16, color: theme => theme.palette.text.secondary }}>
                Your wallet is your digital identity.
            </Typography>
            <Typography marginY={1} sx={{ fontSize: 14, color: theme => theme.palette.text.secondary }}>
                <Link sx={{textDecoration: 'none'}} target="_blank" href="/learn/connecting-a-wallet">Read more</Link>
            </Typography>
            {
                !(MetaMaskOnboarding.isMetaMaskInstalled()) &&
                <Box component="span" marginY={1}
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        onboarding.current.startOnboarding()
                    }}>
                    <Link sx={{textDecoration: 'none'}} href="#">Install metamask</Link>
                </Box>

            }
            <div>
                <LoginLogoutButton
                    variant='contained'
                    closeMenu={() => setHoverMenuOpen(false)}
                    sx={{
                        marginTop: 4,
                        fontSize: 16,
                        paddingY: 0.75,
                        paddingX: 3,
                    }} />
            </div>
        </Box>
    )
}