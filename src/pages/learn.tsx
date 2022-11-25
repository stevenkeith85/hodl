import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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

export default function Learn({ address }) {
    return (
        <Box
            marginX={2}
            marginY={4}
        >
            <HodlBorderedBox>
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                        Learn
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                        Hodl My Moon is an NFT social network and marketplace.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Connecting Your Wallet</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Connecting your wallet is a one-click, cryptographically-secure way to verify your identity. When you connect your wallet, we create a profile for you.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We currently support <Link href="https://metamask.io/">MetaMask</Link>. Other wallets will be supported soon.
                    </Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        Please read <Link href="/learn/connecting-a-wallet">this article</Link> for more information about connecting a wallet.
                    </Typography>
                    <Link href="https://metamask.io/download/" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                        <Button sx={{ marginY: 2 }}>Get MetaMask</Button>
                    </Link>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">About NFTs and their Metadata</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        When you mint an NFT, only the tokenId and a tokenURI is stored on the blockchain. (ERC-721)
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Assets such as images and videos are too large. The tokenURI field points to the metadata that describes the asset.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        In theory that tokenURI could point anywhere. Perhaps to a web server that one day disappears. That would be bad.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        To prevent that, we upload and pin your assets to the <Link href="https://ipfs.io/">Interplanatary File System</Link>. We also pin the metadata there (a JSON file) and point to that via the blockchain.
                    </Typography>
                    <Link href="https://eips.ethereum.org/EIPS/eip-721" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                        <Button sx={{ marginY: 2 }}>View EIP-721</Button>
                    </Link>


                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">About Blockchains and Smart Contracts</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        A blockchain can be thought of like a shared database. A smart contract is a way to execute code that alters the state of this shared database.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We have 2 smart contracts that run on the Polygon blockchain. One allows us to mint NFTs, and the other to trade them.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We run on Polygon because it costs a miniscule amount of cryptocurrency to confirm a transaction there.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        The other reason is that transactions are confirmed much quicker there than many other blockchains. i.e. less waiting around for the user.
                    </Typography>
                    <Link href="https://polygon.technology/" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                        <Button sx={{ marginY: 2 }}>Read about Polygon</Button>
                    </Link>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">How do I mint, is it easy?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Minting a token is easy. No need to know anything about smart contracts or blockchains. (but read on if you are curious)
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We do not charge a minting fee. You only pay the gas (a fraction of a penny on Polygon). We do not receive this fee.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Minting a token essentially writes an entry into that shared database we talked about. (the blockchain).
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        To do that, you need to call a function in a smart contract and pass the url of the metadata. (Well, we do that for you)
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        The smart contract takes care of issuing a tokenId and assigning the url you passed to the tokenUri field, before adding this information to the database.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        To confirm this transaction costs some gas (a transaction fee to keep the network running). This is miniscule on Polygon compared to ethereum.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">What is Trading. Can I do it here?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Trading is the process of listing your NFT on a marketplace; so that another user can purchase it.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We have an integrated marketplace so you can do that very easily here.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Trading is straight-forward. You list your token for the price you are willing to sell it for.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        If it sells, we charge a commision at the point of sale (3%).
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        You can delist your token at any point, and only pay the gas.
                    </Typography>
                    <Typography mb={0} color={theme => theme.palette.text.secondary}>
                        There&apos;s no obligation to use the marketplace.
                    </Typography>
                </Box>

                <Box marginY={4}>
                    <Typography mb={1} variant="h2" >Researching an NFT on Hodl My Moon</Typography>
                    <Typography component="ol" color={theme => theme.palette.text.secondary}>
                        <Typography component="li" mb={1}>Check the IPFS links in the data section of the nft detail page </Typography>
                        <Typography component="li" mb={1}>Check for social validation (likes / comments)</Typography>
                        <Typography component="li" mb={1}>Check the license (if any) assigned to the asset attached to the token</Typography>
                        <Typography component="li" mb={1}>If you aren&apos;t sure; don&apos;t buy</Typography>
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography id="hodler-privilege" mb={1} variant="h2">Asset License</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ span: { fontWeight: 600 } }}>When an author mints an NFT, they <span>must</span> specify what any future hodler can do with the attached asset.</Typography>
                    <Link href="/asset-license" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                        <Button sx={{ marginY: 2 }}>Read about the asset license</Button>
                    </Link>
                </Box>
            </HodlBorderedBox>
        </Box >)
}
