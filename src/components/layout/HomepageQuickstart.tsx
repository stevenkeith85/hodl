import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { HodlBorderedBox } from "../HodlBorderedBox";

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import LoginIcon from '@mui/icons-material/Login';
import FeedIcon from '@mui/icons-material/Feed';


export const HomepageQuickstart = () => (
    <Box sx={{
        marginY: 2,
        textAlign: 'center',
    }}>
        <Typography
            variant='h2'
            color="primary"
            sx={{
                fontFamily: theme => theme.logo.fontFamily,
                marginBottom: 4,
                padding: 0,
                fontSize: 20
            }}>
            Join our Polygon NFT Platform
        </Typography>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
            },
            gap: 4
        }}>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
                <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40, marginBottom: 2}}></AccountBalanceWalletIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Install a Polygon Wallet
                </Typography>

                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>Install a wallet with access to the polygon blockchain.</Typography>
                <Typography sx={{ color: theme => theme.palette.text.secondary }}>We recommend MetaMask or Coinbase Wallet</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
                <OpenInBrowserIcon color="primary" sx={{ fontSize: 40, marginBottom: 2}}></OpenInBrowserIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Open a dApp Browser
                </Typography>

                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>Open the dApp browser in your polygon wallet</Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>And visit this website</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
            <LoginIcon color="primary" sx={{ fontSize: 40, marginBottom: 2}}></LoginIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Log in
                </Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>Click the Connect wallet button</Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>And sign the message</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
                <FeedIcon color="primary" sx={{ fontSize: 40, marginBottom: 2}}></FeedIcon>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Build your feed
                </Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>Follow other polygon NFT creators</Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>See what they mint and list on the marketplace</Typography>
            </HodlBorderedBox>
        </Box>
        <Box sx={{ margin: 4 }}>
            <Link href="/learn/sign-in/coinbase-wallet" sx={{ textDecoration: 'none' }}>
                <Button color="secondary" variant="contained" sx={{ paddingY: 1.5, paddingX: 3 }}>
                    Quickstart with Coinbase Wallet
                </Button>
            </Link>
        </Box>
    </Box>
)
