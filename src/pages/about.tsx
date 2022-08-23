import { AccountBalanceWallet, CircleOutlined, Nightlife, NightlightOutlined, RocketLaunchRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { AboutPagePitch } from "../components/layout/AboutPagePitch";
import { CommercialText } from "../components/tooltips/CommercialTooltip";
import { NonCommercialText } from "../components/tooltips/NonCommercialTooltip";
import { TokenOnlyText } from "../components/tooltips/TokenOnlyTooltip";
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
            <AboutPagePitch />
            <Stack spacing={4}>
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
                <HodlBorderedBox>
                    <Typography mb={1}
                        variant="h2"
                    >
                        Wallets</Typography>
                    <Typography mb={0}>
                        We officially support <Link href="https://metamask.io/">MetaMask</Link>, and recommend connecting with that.
                    </Typography>
                </HodlBorderedBox>
                <HodlBorderedBox>
                    <Typography mb={1} variant="h2">Decentralized storage</Typography>
                    <Typography mb={0}>
                        We upload and pin your assets to the <Link href="https://ipfs.io/">Interplanatary File System</Link>. This ensures the longterm survival of your assets.
                    </Typography>
                </HodlBorderedBox>
                <HodlBorderedBox>
                    <Typography mb={1} variant="h2">Blockchain</Typography>
                    <Typography mb={0}>
                        We run on the <Link href="https://polygon.technology/">Polygon</Link> blockchain for incredibly low transaction fees and quick confirmations.
                    </Typography>
                </HodlBorderedBox>
                <HodlBorderedBox>
                    <Typography mb={1} variant="h2">Minting</Typography>
                    <Typography mb={0}>
                        Minting a token is cheap. We charge a flat rate of 1 Matic (Polygon&apos;s cryptocurrency)
                    </Typography>
                </HodlBorderedBox>
                <HodlBorderedBox>
                    <Typography mb={1} variant="h2">Trading</Typography>
                    <Typography mb={0}>
                        Trading is straight-forward. You list your token for the price you are willing to sell it for. If it sells, we charge 3% commision at the point of sale.
                    </Typography>
                </HodlBorderedBox>
                <HodlBorderedBox>
                    <Typography mb={1} variant="h2">Trust</Typography>
                    <Typography mb={0}>
                        We don&apos;t tolerate plageurism.
                    </Typography>
                </HodlBorderedBox>
                <HodlBorderedBox>
                    <Typography mb={1} variant="h2" >Do your own research</Typography>
                    <ol>
                        <li>Check the IPFS links </li>
                        <li>Check the selling history of the token</li>
                        <li>Check for social validation (likes / comments / follows)</li>
                        <li>Do a google image search</li>
                        <li>Check the privilege assigned to the token</li>
                    </ol>

                </HodlBorderedBox>
                <HodlBorderedBox>
                    <Typography id="copyright" mb={2} variant="h2">Hodler privilege</Typography>
                    <Typography mb={2}>When an author mints an NFT, they must specify what the hodler can do with the attached asset.</Typography>
                    <Typography>We give them a choice of one of the following:</Typography>
                    <Typography sx={{ marginY: 2, color: theme => theme.palette.primary.main}} variant="h3">1. Token Only</Typography>
                    <TokenOnlyText />
                    <Typography sx={{ marginY: 2, color: theme => theme.palette.primary.main}} variant="h3">2. Non Commercial</Typography>
                    <NonCommercialText />
                    <Typography sx={{ marginY: 2, color: theme => theme.palette.primary.main}} variant="h3">3. Commercial</Typography>
                    <CommercialText />
                </HodlBorderedBox>
            </Stack >
        </Box >)
}