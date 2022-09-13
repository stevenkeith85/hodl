import { AccountBalanceWallet } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { authenticate } from "../lib/jwt";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    return {
        props: {
            address: req.address || null,
        }
    }
}

export default function About({ address }) {
    return (
        <Box marginX={8} marginY={4}>
            <HodlBorderedBox>
                <Box mb={4}>
                    <Typography variant="h1" mb={1} sx={{ fontSize: 20 }}>
                        About
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography variant="h2">
                        Quick Start
                    </Typography>
                    <ul>
                        <Link href="https://metamask.io/download/" passHref>
                            <Typography
                                component="a"
                                sx={{
                                    textDecoration: 'none',
                                    color: theme => theme.palette.text.primary,
                                    '&:hover': {
                                        color: theme => theme.palette.secondary.dark,
                                        textDecoration: 'underline'
                                    },
                                }}>
                                <li>Install Metamask</li>
                            </Typography>
                        </Link>
                        <Typography component={"span"}>
                            <li>   Open the <AccountBalanceWallet color="primary" sx={{ fontSize: "18px", marginX: 1, padding: 0 }} /> menu
                                and click
                                <Button
                                    color={'secondary'}
                                    variant={'outlined'}
                                    startIcon={<AccountBalanceWallet />}
                                    sx={{ cursor: 'auto', marginX: 1, paddingX: 1 }}
                                >
                                    connect
                                </Button>
                            </li>
                        </Typography>
                    </ul>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1}
                        variant="h2"
                    >
                        Wallets</Typography>
                    <Typography mb={0}>
                        We officially support <Link href="https://metamask.io/">MetaMask</Link>, and recommend connecting with that.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Decentralized storage</Typography>
                    <Typography mb={0}>
                        We upload and pin your assets to the <Link href="https://ipfs.io/">Interplanatary File System</Link>. This ensures the longterm survival of your assets.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Blockchain</Typography>
                    <Typography mb={0}>
                        We run on the <Link href="https://polygon.technology/">Polygon</Link> blockchain for incredibly low transaction fees and quick confirmations.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Minting</Typography>
                    <Typography mb={0}>
                        Minting a token is cheap. We charge a flat rate of 1 Matic (Polygon&apos;s cryptocurrency)
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Trading</Typography>
                    <Typography mb={0}>
                        Trading is straight-forward. You list your token for the price you are willing to sell it for. If it sells, we charge 3% commision at the point of sale.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Trust</Typography>
                    <Typography mb={0}>
                        We don&apos;t tolerate plageurism.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2" >Do your own research</Typography>
                    <ol>
                        <li>Check the IPFS links </li>
                        <li>Check the selling history of the token</li>
                        <li>Check for social validation (likes / comments / follows)</li>
                        <li>Do a google image search</li>
                        <li>Check the license (if any) assigned to the asset attached to the token</li>
                    </ol>
                </Box>
                <Box marginY={4}>
                    <Typography id="hodler-privilege" mb={2} variant="h2">Asset License</Typography>
                    <Typography mb={2} sx={{ span: { fontWeight: 600 } }}>When an author mints an NFT, they <span>must</span> specify what any future hodler can do with the attached asset. <Link href="/asset-license">read more</Link></Typography>                   
                </Box>
            </HodlBorderedBox>
        </Box >)
}