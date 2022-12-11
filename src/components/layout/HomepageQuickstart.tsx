import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { HodlBorderedBox } from "../HodlBorderedBox";

export const HomepageQuickstart = () => (
    <Box sx={{
        marginY: {
            xs: 2,
        },
        marginX: {
            xs: 0,
            sm: 4
        },
        marginBottom: {
            xs: 4,
        },
        textAlign: 'center',
    }}>
        <Typography
            variant='h2'
            color="primary"
            sx={{
                fontFamily: theme => theme.logo.fontFamily,
                marginBottom: 2,
                padding: 0,
                fontSize: 20
            }}>
            Join our Polygon NFT platform
        </Typography>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr 1fr',
            },
            gap: 2
        }}>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Install a polygon wallet
                </Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>Install a wallet with access to the polygon blockchain.</Typography>
                <Typography sx={{ color: theme => theme.palette.text.secondary }}>We support MetaMask, Coinbase Wallet or WalletConnect</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Open a dApp browser
                </Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>You can log in to Hodl My Moon with the dApp browser in your polygon wallet</Typography>
                <Typography sx={{ color: theme => theme.palette.text.secondary }}>Or with WalletConnect</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Click connect
                </Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>Locate the connect button in our main menu and click it.</Typography>
                <Typography sx={{ color: theme => theme.palette.text.secondary }}>Sign the message to verify your identity</Typography>
            </HodlBorderedBox>
            <HodlBorderedBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        marginBottom: 2,
                        padding: 0,
                        fontSize: 16
                    }}>
                    Follow polygon NFT creators
                </Typography>
                <Typography mb={2} sx={{ color: theme => theme.palette.text.secondary }}>Like and comment on your favourite polygon NFTs</Typography>
                <Typography sx={{ color: theme => theme.palette.text.secondary }}>Or buy and sell on our polygon nft marketplace</Typography>
            </HodlBorderedBox>
        </Box>
        <Box sx={{ margin: 4 }}>
            <Link href="/learn/sign-in/coinbase-wallet" sx={{ textDecoration: 'none'}}>
                <Button color="secondary" variant="contained" sx={{ paddingY: 1.5, paddingX: 3 }}>
                    Quickstart with Coinbase Wallet
                </Button>
            </Link>
        </Box>
    </Box>
)
