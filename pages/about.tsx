import { RocketSharp } from "@mui/icons-material";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { grey, pink } from "@mui/material/colors";
import Link from "next/link";
import { AboutPagePitch } from "../components/layout/AboutPagePitch";
import { HomePagePitch } from "../components/layout/HomePagePitch";
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
        <Box marginY={0}>
            <Stack spacing={4}>
                <AboutPagePitch />
                {/* <Box
                    sx={{
                        border: '1px solid #ddd',
                        boxShadow: '0 0 2px 1px #eee',
                        padding: 4,
                        borderRadius: 1,
                        background: "#fefefe"
                    }}> */}
                    <Box>
                    <Typography 
                        mb={1} 
                        variant="h2" 
                        >Quick Start</Typography>
                    <Typography 
                        // mb={2} 
                        component="ul">
                        <Typography mb={1} component="li">
                            <Link href="https://metamask.io/download/">
                                Install Metamask
                            </Link>
                        </Typography>
                        <Typography mb={2} component="li">Click <Box component={"span"} sx={{ margin: 1 }}><LoginLogoutButton /></Box> and sign the message</Typography>
                    </Typography>
                    </Box>
                {/* </Box> */}
                <Box>
                    <Typography mb={1} 
                        variant="h2" 
                        // color="primary"
                        >
                            Wallets</Typography>
                    <Typography mb={0}>
                        We officially support <Link href="https://metamask.io/">MetaMask</Link>, and recommend connecting with that.
                    </Typography>
                </Box>
                <Box>
                    <Typography mb={1} variant="h2">Decentralized Storage</Typography>
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
                    <Typography mb={1} variant="h2" >Do Your Own Research</Typography>
                    
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
                    <Typography id="copyright" mb={2} variant="h2">Hodler Privilege</Typography>
                        When an author mints an NFT, they specify what a person gets if they hodl it.
                        <ol>
                            <li>Only the token</li>
                            <li>The token and a non-commercial license for the attached asset</li>
                            <li>The token and a commercial license for the attached asset</li>
                        </ol>
                </Box>
            </Stack>
        </Box>)
}