import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';

import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import dynamic from 'next/dynamic';
import { HodlLoadingSpinner } from '../HodlLoadingSpinner';
import { LoginLogoutButton } from './LoginLogoutButton';


const LoggedInMenuLoading = () => (
    <div>
        <HodlLoadingSpinner sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: 1, height: '100%', alignItems: 'center' }} />
    </div>
)

const LoggedOutMenuLoading = () => (
    <div>
        <HodlLoadingSpinner sx={{ display: 'flex', justifyContent: 'center', width: '100%', padding: 1, height: '100%', alignItems: 'center' }} />
    </div>
)

const LoggedInMenu = dynamic(
    () => import('./LoggedInMenu').then(mod => mod.LoggedInMenu),
    {
        ssr: false,
        loading: () => <LoggedInMenuLoading />
    }
);

const LoggedOutMenu = dynamic(
    () => import('./LoggedOutMenu').then(mod => mod.LoggedOutMenu),
    {
        ssr: false,
        loading: () => <LoggedOutMenuLoading />
    }
);


interface WalletMenuPageProps {
    hoverMenuOpen: boolean;
    setHoverMenuOpen: Function;
}

export const WalletMenuPage: React.FC<WalletMenuPageProps> = ({
    setHoverMenuOpen,
    hoverMenuOpen,
}) => {
    const router = useRouter();
    const { address } = useContext(WalletContext);

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


    return (
        <ClickAwayListener
            onClickAway={e => {
                e.stopPropagation();
                if (hoverMenuOpen) {
                    setHoverMenuOpen(false)
                }

            }}
            touchEvent={false}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxSizing: 'border-box'
            }}>
                <Box sx={{
                    flexGrow: 1,
                    flexShrink: 0,
                    flexBasis: 'auto',
                    boxSizing: 'border-box',
                    marginBottom: 4
                }}>
                    {address &&
                        <LoggedInMenu />
                    }
                    {!address &&
                        <LoggedOutMenu />
                    }
                </Box>

                <LoginLogoutButton
                    variant='contained'
                    closeMenu={() => setHoverMenuOpen(false)}
                    sx={{
                        paddingY: 1,
                        paddingX: 2,
                    }} />
            </Box>
        </ClickAwayListener >
    )
}
