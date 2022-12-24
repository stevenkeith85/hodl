import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { HodlBorderedBox } from "../HodlBorderedBox";

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import LoginIcon from '@mui/icons-material/Login';



export const HomepageQuickstart = () => (
    <Box sx={{
        marginY: 6,
    }}>
        <Typography
            variant='h2'
            color="primary"
            sx={{
                fontFamily: theme => theme.logo.fontFamily,
                marginBottom: 4,
                padding: 0,
                fontSize: 18,
                textAlign: {
                    xs: 'center',
                    sm: 'left'
                }
            }}>
            Join our Polygon NFT Platform
        </Typography>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
            },
            gap: 8,
            marginBottom: 4
        }}>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6, textAlign: 'center' }}>
                <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 44, marginBottom: 2 }}></AccountBalanceWalletIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 3,
                        padding: 0,
                        fontSize: 18
                    }}>
                    Install a Polygon Wallet
                </Typography>

                <Typography mb={3} sx={{  fontSize: 15, color: theme => theme.palette.text.secondary }}>Get a Polygon wallet from the Play store, App store, or as a Google Chrome extension.</Typography>
                <Typography mb={0} sx={{  fontSize: 15, color: theme => theme.palette.text.secondary }}>We recommend <Link target="_blank" href="https://metamask.io/">MetaMask</Link> or <Link target="_blank" href="https://www.coinbase.com/wallet">Coinbase Wallet</Link>.</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6, textAlign: 'center' }}>
                <OpenInBrowserIcon color="primary" sx={{ fontSize: 44, marginBottom: 2 }}></OpenInBrowserIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 3,
                        padding: 0,
                        fontSize: 18
                    }}>
                    Open a Web Browser
                </Typography>
                <Typography mb={3} sx={{  fontSize: 15, color: theme => theme.palette.text.secondary }}>Open Google Chrome or your wallet&apos;s integrated browser.</Typography>
                <Typography mb={0} sx={{  fontSize: 15, color: theme => theme.palette.text.secondary }}>Visit <Link target="_blank" href="https://www.hodlmymoon.com">Hodl My Moon</Link></Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6, textAlign: 'center' }}>
                <ConnectWithoutContactIcon color="primary" sx={{ fontSize: 44, marginBottom: 2 }}></ConnectWithoutContactIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 3,
                        padding: 0,
                        fontSize: 18
                    }}>
                    Connect
                </Typography>
                <Typography mb={3} sx={{  fontSize: 15, color: theme => theme.palette.text.secondary }}>Click the Connect Wallet button</Typography>
                <Typography mb={0} sx={{  fontSize: 15, color: theme => theme.palette.text.secondary }}>Select your wallet&apos;s logo, or WalletConnect for Mobile Chrome to Mobile Wallet</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6, textAlign: 'center' }}>
                <LoginIcon color="primary" sx={{ fontSize: 44, marginBottom: 2 }}></LoginIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 3,
                        padding: 0,
                        fontSize: 18
                    }}>
                    Sign In
                </Typography>
                <Typography mb={3} sx={{ fontSize: 15, color: theme => theme.palette.text.secondary }}>Click the Sign Message button</Typography>
                <Typography mb={0} sx={{  fontSize: 15, color: theme => theme.palette.text.secondary }}>Sign the message when prompted by your wallet to create an account</Typography>
            </HodlBorderedBox>
        </Box>
    </Box>
)
