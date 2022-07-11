import { RocketSharp } from "@mui/icons-material";
import { Alert, Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function About() {
    return (
        <Box marginY={4}>
            <Stack spacing={4}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <RocketSharp color="secondary" />
                    <Typography color="secondary" variant="h1">
                        About
                    </Typography>
                </Stack>
                <Box>
                    <Typography mb={1}>
                        Hodl My Moon is a Social NFT Platform
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Decentralized Storage</Typography>
                    <Typography mb={0}>
                        We upload and pin your assets to the Interplanatary File System. This ensure's the longterm survival of your assets.
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
                        Minting a token is cheap. We charge a flat rate of 1 Matic (+ gas)
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
                        We don't tolerate plageurism.
                    </Typography>
                    <Alert sx={{
                        ol: {
                            p: 0,
                            m: 0,
                            mt: 2,
                            ml: 2
                        }
                    }}>
                        We do encourage users to DYOR before buying an NFT.
                        <ol>
                            <li>Check the IPFS Image and Metadata </li>
                            <li>Check the selling history (if any) of the token</li>
                            <li>Check for social validation </li>
                            <li>Do a Google image search</li>
                            <li>Check what you are getting (<Link href="#copyright">See Hodler Privilege section</Link>)</li>
                        </ol>
                    </Alert>
                    <Typography mt={2} mb={2}>
                        If something looks too good to be true, it probably is.
                    </Typography>
                </Box>
                <Box>
                    <Typography id="copyright" mb={2} variant="h2" color="primary">Hodler Privilege</Typography>
                    <Alert sx={{
                        ol: {
                            p: 0,
                            m: 0,
                            mt: 2,
                            ml: 2
                        }
                    }}>
                        When you buy an NFT you will get one of the following: (selected by the token author at mint time)
                        <ol>
                            <li>Only the token*</li>
                            <li>The token and a non-commercial license for the attached asset</li>
                            <li>The token and a commercial license for the attached asset</li>
                        </ol>

                    </Alert>
                    <Typography mt={2} sx={{ span: { fontWeight: 600 } }}>
                        * this could be used in creative ways such as identifying a character in a computer game, or permitting entry to a rock concert
                    </Typography>
                </Box>
            </Stack>
        </Box>)
}