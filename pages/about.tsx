import { AccountBalanceWallet, CircleOutlined, Nightlife, NightlightOutlined, RocketLaunchRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { AboutPagePitch } from "../components/layout/AboutPagePitch";
import { LoginLogoutButton } from "../components/menu/LoginLogoutButton";
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
        <Box marginY={0} mb={4}>
            <Stack spacing={4}>
                <AboutPagePitch />
                <HodlBorderedBox
                    sx={{
                        background: 'white',
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography
                        variant="h2"
                        fontSize={'18px'}
                        mb={2}
                    >
                        Quick Start
                    </Typography>

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
                            <CircleOutlined sx={{ fontSize: '10px', marginX: 2 }} />
                            Install Metamask
                        </Typography>
                    </Link>
                    <Typography component={"span"}>
                        <CircleOutlined sx={{ fontSize: '10px', marginX: 2 }} />
                        Open the <AccountBalanceWallet color="primary" sx={{ fontSize: "18px", marginX: 1, padding: 0 }} /> menu
                        and click
                        <Button
                            color={'secondary'}
                            variant={'outlined'}
                            startIcon={<AccountBalanceWallet />}
                            sx={{ cursor: 'auto', marginX: 1, paddingX: 1 }}
                        >
                            connect
                        </Button>
                    </Typography>

                </HodlBorderedBox>
                <Box>
                    <Typography mb={1}
                        variant="h2"
                    >
                        Wallets</Typography>
                    <Typography mb={0}>
                        We officially support <Link href="https://metamask.io/">MetaMask</Link>, and recommend connecting with that.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2">Decentralized storage</Typography>
                    <Typography mb={0}>
                        We upload and pin your assets to the <Link href="https://ipfs.io/">Interplanatary File System</Link>. This ensures the longterm survival of your assets.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2">Blockchain</Typography>
                    <Typography mb={0}>
                        We run on the <Link href="https://polygon.technology/">Polygon</Link> blockchain for incredibly low transaction fees and quick confirmations.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2">Minting</Typography>
                    <Typography mb={0}>
                        Minting a token is cheap. We charge a flat rate of 1 Matic (Polygon&apos;s cryptocurrency)
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2">Trading</Typography>
                    <Typography mb={0}>
                        Trading is straight-forward. You list your token for the price you are willing to sell it for. If it sells, we charge 3% commision at the point of sale.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2">Trust</Typography>
                    <Typography mb={0}>
                        We don&apos;t tolerate plageurism.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" >Do your own research</Typography>

                    We do encourage users to DYOR before buying an NFT.
                    <ol>
                        <li>Check the IPFS links </li>
                        <li>Check the selling history of the token</li>
                        <li>Check for social validation (likes / comments / follows)</li>
                        <li>Do a google image search</li>
                        <li>Check the privilege assigned to the token</li>
                    </ol>

                </Box>
                <Box>
                    <Typography id="copyright" mb={2} variant="h2">Hodler privilege</Typography>
                    When an author mints an NFT, they specify what a person gets if they hodl it.
                    <ol>
                        <li>Only the token</li>
                        <li>The token and a non-commercial license for the attached asset</li>
                        <li>The token and a commercial license for the attached asset</li>
                    </ol>
                </Box>
            </Stack >
        </Box >)
}