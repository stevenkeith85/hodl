import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";

import { HodlBorderedBox } from "../../components/HodlBorderedBox";
import { authenticate } from "../../lib/jwt";

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
        width: '400px',
        maxWidth: '100%',
        img: {
            width: '100%'
        }
    }}>
    <img src={`https://res.cloudinary.com/dyobirj7r/image/upload/w_412/docs/${public_id}.jpg`}></img>
</Box>)

export default function SignUp({ address }) {
    const title = "Sign up to Hodl My Moon With Coinbase Mobile Wallet";

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Box marginX={2} marginY={4}>
                <HodlBorderedBox>
                    <Box mb={3}>
                        <Typography variant="h1" mb={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Sign up to Hodl My Moon
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            For this guide, we will be using the Coinbase Wallet mobile app. (The process for MetaMask is the same)
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            You can download Coinbase Wallet on <Link href="https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455">ios</Link> or <Link href="https://play.google.com/store/apps/details?id=org.toshi&hl=en_GB&gl=US&pli=1">android</Link>
                        </Typography>
                    </Box>
                    <Typography variant="h1" mb={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                        Steps
                    </Typography>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            1) Open the app and click on the browser button at the bottom. Enter https://www.hodlmymoon.com into the address bar.
                        </Typography>
                        <ImageBox public_id={"goskydcbp4eda82td2nt"} />
                    </Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            2) Click the wallet icon in the top right on the screen and click connect wallet.
                        </Typography>
                        <ImageBox public_id={"xxevrfj60f9imvgdr2bo"} />
                    </Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={0} color={theme => theme.palette.text.secondary}>
                            3) You'll be asked to sign a message to prove your identity.
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            This is a cryptographically-secure way to log in to dApps.
                        </Typography>
                        <ImageBox public_id={"ekxo7rzpari6twpobhd7"} />
                    </Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            4) You will be taken to the feed screen. From here you can follow a few accounts.
                        </Typography>
                        <ImageBox public_id={"gd2ybhvilncouwm08lwk"} />
                    </Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            5) A refresh button will appear. Click on it to reload the feed.
                        </Typography>
                        <ImageBox public_id={"hlf1outf0blvc4x9p9nj"} />
                    </Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={0} color={theme => theme.palette.text.secondary}>
                            6) You will initially get up to 5 posts from each person you followed.feed.
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            You will receive their new nfts in your feed; as well as their market activity.
                        </Typography>
                        <ImageBox public_id={"bq7ukmhlmq3eawkykbcl"} />
                    </Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={0} color={theme => theme.palette.text.secondary}>
                            7) Click the toggle in the top right to see your profile badge.
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} mb={2} color={theme => theme.palette.text.secondary}>
                            It shows the number of users you just followed, plus some other stats.
                        </Typography>
                        <ImageBox public_id={"gfvkhsfm4eqygzbc32ie"} />
                    </Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 14 }} mb={0} color={theme => theme.palette.primary.main}>
                            Success!
                        </Typography>
                    </Box>
                
                </HodlBorderedBox>
            </Box>
        </>
    )
}
