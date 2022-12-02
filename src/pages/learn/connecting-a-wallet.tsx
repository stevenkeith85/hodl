import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

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

export default function ConnectingAWallet({ address }) {
    return (
        <Box marginX={2} marginY={4}>
            <HodlBorderedBox>
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                        Signing in to Hodl My Moon with your wallet
                    </Typography>

                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Connecting your wallet is a cryptographically-secure way to verify your identity.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        When your connect your wallet we create your profile, and redirect you to your feed page.
                    </Typography>
                </Box>

                <Box marginY={4}>
                    <Typography mb={1} variant="h2">How to Connect</Typography>
                    <Typography color={theme => theme.palette.text.secondary}>
                        You can connect to our website on your desktop or on your mobile in a normal web browser.
                    </Typography>
                    <Typography mt={3} mb={1} variant="h3">Wallet Connect</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Select this to connect with MetaMask or <Link href="https://explorer.walletconnect.com/?type=wallet" target="_blank">any other supported wallet</Link>
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        You scan a QR code from your wallet.
                    </Typography>
                    <Typography mt={3} mb={1} variant="h3">Coinbase Wallet. </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Coinbase provide their own implementation that lets you connect to your mobile or desktop wallet.
                    </Typography>
                    <Typography color={theme => theme.palette.text.secondary}>
                        It works similar to Wallet Connect
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Signing a Message</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We authenticate you by asking you to sign a message with your wallet.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        This does not trigger a blockchain transaction; is secure; and does not cost you are money.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Can you access my private keys or secret recovery phrase?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        No.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We do not hold your keys. We do not want your keys.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Signing a message to log in to our website does not give us access to your private key or secret recovery phrase.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Can you initiate a transaction on my behalf?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        No.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">How are transaction&apos;s initiated?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        We use JavaScript to trigger MetaMask to ask you to if you&apos;d like to confirm a transaction on the blockchain. You&apos;ll get a pop up window.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">When might I be asked to confirm a transaction on Hodl My Moon?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        You could be asked if you&apos;d like to confirm a transaction if you:</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} component="ul">
                        <li>Want to create a post (nft). Every post on our website is an nft.</li>
                        <li>Want to list or delist an nft on the marketplace.</li>
                        <li>Want to purchase an nft from the marketplace.</li>
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">When won&apos;t I be asked to confirm a transaction on Hodl My Moon?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        When you do anything web2, such as:
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} component="ul">
                        <li>Change your nickname</li>
                        <li>Change your avatar (this is also an nft btw)</li>
                        <li>Follow or unfollow other users</li>
                        <li>Like a post</li>
                        <li>Comment on a post</li>
                        <li>Share a post</li>
                        <li>Any time we do not write something to the blockchain.</li>
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">And I can reject every transaction?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Yes. I&apos;m not sure why you&apos;d want to; but you can.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Do you have any technical links I can read?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Yes. If you are a programmer than I&apos;d suggest starting with <Link target="_new" href="https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial">this article on TopTal</Link> which describes the process
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={1} variant="h2">Do other sites do this?</Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary}>
                        Yes. The process is called SIWE (Sign in with Ethereum) and is common with decentralized applications.
                    </Typography>
                </Box>
            </HodlBorderedBox>
        </Box >)
}
