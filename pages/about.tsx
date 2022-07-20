import { RocketSharp } from "@mui/icons-material";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Link from "next/link";
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
        <Box marginY={4}>
            <Stack spacing={6}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography color="secondary" variant="h1">
                        About
                    </Typography>
                </Stack>
                <Box>
                    <Typography fontSize="18px" sx={{ color: grey[700] }}>
                        Hodl My Moon is an NFT Social Platform
                    </Typography>
                </Box>
                <Box
                    sx={{
                        border: '1px solid #ddd',
                        boxShadow: '0 0 2px 1px #eee',
                        padding: 4,
                        borderRadius: 1
                    }}>
                    <Typography mb={2} variant="h2" color="primary">Quick Start</Typography>
                    <Typography mb={2} component="ul">
                        <Typography mb={2} component="li">
                            <Link href="https://metamask.io/download/">
                                Install Metamask
                            </Link>
                        </Typography>
                        <Typography mb={2} component="li">Click <LoginLogoutButton /> and sign the message</Typography>
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Wallets</Typography>
                    <Typography mb={0}>
                        We officially support MetaMask, and recommend connecting with that.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Decentralized Storage</Typography>
                    <Typography mb={0}>
                        We upload and pin your assets to the Interplanatary File System (https://ipfs.io/). This ensures the longterm survival of your assets.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Blockchain</Typography>
                    <Typography mb={0}>
                        We run on the Polygon blockchain for incredibly low transaction fees and quick confirmations.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Minting</Typography>
                    <Typography mb={0}>
                        Minting a token is very cheap. We charge a flat rate of 1 Matic (+ gas)
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Trading</Typography>
                    <Typography mb={0}>
                        Trading is straight-forward. You list your token for the price you are willing to sell it for. If it sells, we charge 3% commision at the point of sale.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2" color="primary">Trust</Typography>
                    <Typography mb={2}>
                        We don&apos;t tolerate plageurism.
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
                            <li>Check for social validation; likes / comments</li>
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
                        When you buy an NFT you will get one of the following: (selected by the token author when they create an NFT)
                        <ol>
                            <li>Only the token*</li>
                            <li>The token and a non-commercial license for the attached asset</li>
                            <li>The token and a commercial license for the attached asset</li>
                        </ol>

                    </Alert>
                    <Typography mt={2} sx={{ span: { fontWeight: 600 } }}>
                        * this could be used in creative ways such as permitting entry to a rock concert
                    </Typography>
                </Box>
            </Stack>
        </Box>)
}