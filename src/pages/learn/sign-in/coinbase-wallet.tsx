import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";

import { HodlBorderedBox } from "../../../components/HodlBorderedBox";
import { authenticate } from "../../../lib/jwt";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    return {
        props: {
            address: req.address || null,
        }
    }
}

const ImageBox = ({ public_id }) => (<Box
    sx={{
        border: '1px solid #ddd',
        margin: 0,
        padding: 0,
        lineHeight: 0,
        width: '350px',
        maxWidth: '100%',
        img: {
            width: '100%'
        }
    }}>
    <img src={`https://res.cloudinary.com/dyobirj7r/image/upload/w_412/docs/${public_id}.jpg`}></img>
</Box>)

export default function CoinbaseWallet({ address }) {
    const title = "Sign in to dApps with Coinbase Wallet";
    const description = "Learn how to sign in to dApps with the coinbase wallet mobile app"
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            <Box marginX={2} marginY={4}>
                <HodlBorderedBox>
                    <Box mb={3}>
                        <Typography variant="h1" mb={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Sign in to a dApp with Coinbase Wallet
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            For this guide, we will be using the Coinbase Wallet mobile app, and connecting to Hodl My Moon.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            Hodl My Moon is a Polygon NFT Marketplace and Social Network.
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            You can download coinbase wallet on <Link href="https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455">ios</Link> or <Link href="https://play.google.com/store/apps/details?id=org.toshi&hl=en_GB&gl=US&pli=1">android</Link>
                        </Typography>
                    </Box>
                    <Typography variant="h1" mb={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                        7 Simple Steps
                    </Typography>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Step 1
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.secondary}>
                            Open coinbase wallet and click on the browser button at the bottom.
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            Enter https://www.hodlmymoon.com into the address bar.
                        </Typography>
                        <ImageBox public_id={"goskydcbp4eda82td2nt"} />
                    </Box>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Step 2
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            Click the wallet icon in the top right on the screen and click connect wallet.
                        </Typography>
                        <ImageBox public_id={"xxevrfj60f9imvgdr2bo"} />
                    </Box>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Step 3
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.secondary}>
                            You will be asked to sign a message to prove your identity.
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            This is a cryptographically-secure way to log in to dApps.
                        </Typography>
                        <ImageBox public_id={"ekxo7rzpari6twpobhd7"} />
                    </Box>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Step 4
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            You will be taken to the feed screen. From here you can follow a few accounts.
                        </Typography>
                        <ImageBox public_id={"gd2ybhvilncouwm08lwk"} />
                    </Box>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Step 5
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            A refresh button will appear. Click on it to reload the feed.
                        </Typography>
                        <ImageBox public_id={"hlf1outf0blvc4x9p9nj"} />
                    </Box>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Step 6
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.secondary}>
                            Your feed will populate with recent posts (nfts) from the accounts you just followed.
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            You will receive their new polygon nfts in your feed; as well as their market activity.
                        </Typography>
                        <ImageBox public_id={"bq7ukmhlmq3eawkykbcl"} />
                    </Box>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Step 7
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.secondary}>
                            Click the toggle in the top right to see your profile badge.
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            It shows the number of users you just followed, plus some other stats.
                        </Typography>
                        <ImageBox public_id={"gfvkhsfm4eqygzbc32ie"} />
                    </Box>
                    <Box mb={4}>
                        <Typography sx={{ fontSize: 14 }} mb={1} color={theme => theme.palette.text.primary}>
                            Congrats
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            You have just jumped in to the wonderful world of web3.
                        </Typography>
                    </Box>
                    <Link href="/learn/" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                        <Button sx={{ marginY: 2 }}>NFT and DApp learning hub</Button>
                    </Link>
                </HodlBorderedBox>
            </Box>
        </>
    )
}
