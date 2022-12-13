import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useEffect, useRef } from "react";
import { LoginLogoutButton } from "./LoginLogoutButton";
import MetaMaskOnboarding from '@metamask/onboarding'
import Link from 'next/link';

export const LoggedOutMenu = ({ setHoverMenuOpen }) => {
    const onboarding = useRef<MetaMaskOnboarding>();

    const pages = [
        { title: "Home", url: '/' },
        { title: "Explore", url: '/explore' },
        { title: "Learn", url: '/learn' }
    ]
    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    return (
        <Box
        sx={{
            display:"flex",
            flexDirection:"column",
        }}
        >
            <Box>
                {pages.map(({ title, url }) => <Link href={url} key={url}>
                    <Typography
                        sx={{
                            fontSize: 16,
                            marginLeft: 2,
                            marginY: 2,
                            '&:hover': {
                                color: "secondary.main",
                                cursor: 'pointer'
                            }
                        }}>
                        {title}
                    </Typography>
                </Link>
                )}
            </Box>
            <LoginLogoutButton
                variant='contained'
                closeMenu={() => setHoverMenuOpen(false)}
                sx={{
                    marginTop: 4,
                    paddingY: 0.75,
                    paddingX: 3,
                }} />
        </Box>
    )
}