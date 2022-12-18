import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';

import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";

import dynamic from 'next/dynamic';
import { HodlLoadingSpinner } from '../HodlLoadingSpinner';
import { WalletDetails } from '../WalletDetails';
import { LoggedOutMenu } from './LoggedOutMenu';
import { ConnectButton } from './ConnectButton';
import { DisconnectButton } from './DisconnectButton';
import { WalletContext } from '../../contexts/WalletContext';


const LoggedInMenuLoading = () => (
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

interface WalletMenuPageProps {
    hoverMenuOpen: boolean;
    setHoverMenuOpen: Function;
}

export const WalletMenuPage: React.FC<WalletMenuPageProps> = ({
    setHoverMenuOpen,
    hoverMenuOpen,
}) => {
    const router = useRouter();

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

    const { walletAddress } = useContext(WalletContext);

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
                boxSizing: 'border-box',
                gap: 4
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    flexShrink: 0,
                    flexBasis: 'auto',
                    gap: 4
                }}>
                    <WalletDetails />
                    <LoggedOutMenu />
                    <LoggedInMenu />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 1
                }}>
                    { !walletAddress && <ConnectButton onConnected={() =>setHoverMenuOpen(false)} /> }
                    { walletAddress && <DisconnectButton  onDisconnected={() =>setHoverMenuOpen(false)} />}
                </Box>
            </Box>
        </ClickAwayListener >
    )
}
