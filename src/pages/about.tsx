import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

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
        <Box 
            marginX={2} 
            marginY={4}
            >
            <HodlBorderedBox>
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                        About
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                        Hodl My Moon is a web3 social network and marketplace.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography variant="h2" mb={2}>
                        Quick Start
                    </Typography>
                    <Typography component="ul">
                    <Typography component="li" mb={1}>
                            <Link target="_blank" href="https://metamask.io/download/">
                                Install Metamask
                            </Link>
                        </Typography>
                        <Typography component="li" mb={1}>
                            Click &quot;Connect&quot; on the homepage
                        </Typography>
                        <Typography component="li" mb={1}>
                            Switch to Polygon Mainnet
                        </Typography>
                        <Typography component="li" mb={1}>
                            Get some Matic
                        </Typography>
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1}
                        variant="h2"
                    >
                        Wallets</Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        We officially support <Link href="https://metamask.io/">MetaMask</Link>, and recommend connecting with that.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Decentralized storage</Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        We upload and pin your assets to the <Link href="https://ipfs.io/">Interplanatary File System</Link>. This ensures the longterm survival of your assets.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Blockchain</Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        We run on the <Link href="https://polygon.technology/">Polygon</Link> blockchain for incredibly low gas fees and quick transaction confirmations.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Minting</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Minting a token is easy. No need to know anything about smart contracts or blockchains.
                    </Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        We add a small minting fee to help cover our costs, and 
                        deter spam.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Trading</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Trading is straight-forward. You list your token for the price you are willing to sell it for.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        If it sells, we charge a commision at the point of sale.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Typically this will be 3%
                    </Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        You can delist your token at any point, and only pay the gas.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Trust</Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        We don&apos;t tolerate plageurism.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2" >Do your own research</Typography>
                    <Typography component="ol" color={theme => theme.palette.text.secondary}>
                        <Typography component="li" mb={1}>Check the IPFS links </Typography>
                        <Typography component="li" mb={1}>Check for social validation (likes / comments)</Typography>
                        <Typography component="li" mb={1}>Check the license (if any) assigned to the asset attached to the token</Typography>
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography id="hodler-privilege" mb={1} variant="h2">Asset License</Typography>
                    <Typography mb={2} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>When an author mints an NFT, they <span>must</span> specify what any future hodler can do with the attached asset. <Link href="/asset-license">read more</Link></Typography>
                </Box>
            </HodlBorderedBox>
        </Box >)
}
