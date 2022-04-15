import { RocketSharp } from "@mui/icons-material";
import { Alert, Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function About() {
    return (
        <Box marginY={4}>
            <Stack spacing={6}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <RocketSharp color="secondary" />
                    <Typography color="secondary" variant="h1">
                        About
                    </Typography>
                </Stack>
                <Box>
                    <Typography mb={1}>
                        Hodl My Moon is an <Link href="/">NFT platform</Link>
                    </Typography>
                    <Typography mb={1}>
                        Here, you can <Link href="/mint">mint a token</Link>, showcase it in your profile, and (when the time is right) trade it with others.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Blockchain</Typography>
                    <Typography mb={0}>
                        We run on the Polygon (Matic) blockchain for incredibly low transaction fees and quick confirmations.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Minting</Typography>
                    <Typography mb={0}>
                        Minting a token is cheap. We charge you nothing. It will only cost you gas (a blockchain transaction fee), which is super cheap on Polygon (compared to Layer 1 blockchains).
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Trading</Typography>
                    <Typography mb={0}>
                        Trading is straight-forward. You list your token for the price you are willing to sell it for. If it sells, we charge 3% commision at the point of sale.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Wallets</Typography>
                    <Typography mb={0}>
                        We officially support MetaMask, and recommend connecting with that.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Trust</Typography>
                    <Typography mb={2}>
                        We deplore any attempt to conterfeit other&apos;s work. We will do everything we can to prevent this type of activity occurring on our platform.
                    </Typography>
                    <Alert sx={{
                        ol: {
                            p: 0,
                            m: 0,
                            mt: 2,
                            ml: 2
                        }
                    }}>
                        We also encourage users to DYOR (Do Your Own Research) before buying an NFT.
                        <ol>
                            <li>Check the IPFS Image and Metadata </li>
                            <li>Check the selling history (if any) of the token</li>
                            <li>Check the owner&apos;s activity.</li>
                            <li>Check for social validation </li>
                            <li>Do a Google image search</li>
                            <li>Check what you are getting (<Link href="#copyright">See Copyright section</Link>)</li>
                        </ol>
                    </Alert>
                </Box>
                <Box>
                    <Typography id="copyright" mb={2} variant="h2" color="primary">Copyright</Typography>
                    <Alert sx={{
                        ol: {
                            p: 0,
                            m: 0,
                            mt: 2,
                            ml: 2
                        }
                    }}>
                        When you buy an NFT you will get one of the following: (decided by the token author at mint time)
                        <ol>
                            <li>Only the token*</li>
                            <li>The token and a non-commercial license for the attached asset</li>
                            <li>The token and a commercial license for the attached asset</li>
                        </ol>

                    </Alert>
                    <Typography mt={2} sx={{ span: { fontWeight: 600 } }}>
                        * this could be used in creative ways such as identifying a character in a computer game.
                    </Typography>
                    <Typography mt={2} sx={{ span: { fontWeight: 600 } }}>
                        In addition to the above, by using this website token authors agree for the display and fair use of their token on Hodl My Moon (in general).
                        i.e. If we can&apos;t show other users your token, then how can they buy it?
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Disclaimer</Typography>
                    <Typography mb={1} sx={{ span: { fontWeight: 600 } }}>
                        Finally, <span>we will do our best</span> to make this a great place for all; but accept no legal responsibility for the actions of our users&apos;.
                    </Typography>
                </Box>
            </Stack>
        </Box>)
}