import { Button } from "@mui/material";
import Box from "@mui/material/Box";
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

export default function InteractWithDApps({ address }) {
    const title = "How to interact with decentralized applications (dApps)";
    const description = "Learn how to connect and interact with dApps using your wallet";
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            <Box marginX={2} marginY={4}>
                <HodlBorderedBox>
                    <Box mb={4}>
                        <Typography component="h1" mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            How to interact with dApps.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Cryptocurrency wallets allow you to send and receive cryptocurrencies like ether and matic.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            They also function as a dApp browser.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            What is a dApp browser?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A dApp browser is a way to interact with decentralized applications.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            With an old school website like myspace or bebo, you could connect to them with a old school web browser such as Internet Explorer.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Connecting to a web3 enabled site, or a dApp, requires you to connect with a browser that can talk to the blockchain.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            What browsers can talk to the blockchain?
                        </Typography>
                        <Typography component="h3" mb={1} color={theme => theme.palette.text.primary}>
                            Desktop
                        </Typography><Typography mb={1} color={theme => theme.palette.text.secondary}>
                            If you add a cryptocurrency wallet extension, then google chrome can!
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You navigate to the chrome web store, you will be able to find extensions for wallets such as MetaMask and Coinbase
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Once you have installed the extension, you can navigate to a web3 enabled site and click connect.
                        </Typography>
                        <Typography component="h3" mb={1} color={theme => theme.palette.text.primary}>
                            Mobile
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            The browser located inside your cryptocurrency wallet app can!
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            If you open up your favourite cryptocurrency wallet these days, there is a good chance it has an integrated web browser.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            If you navigate to a website in that browser, you will have options to connect.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            What is the simplest way to connect to a dApp?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Desktop
                        </Typography>
                        <Typography component="ul" mb={1} color={theme => theme.palette.text.secondary}>
                            <Typography component="li">Get the MetaMask or Coinbase Wallet browser extension from the chrome store.</Typography>
                            <Typography component="li">Visit the dApp in chrome.</Typography>
                            <Typography component="li">Find the connect button, and click connect</Typography>
                            <Typography component="li">Your extension will pop up and take you from there. </Typography>
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Mobile
                        </Typography>
                        <Typography component="ul" mb={1} color={theme => theme.palette.text.secondary}>
                            <Typography component="li">Get the MetaMask or Coinbase Wallet mobile app from the play or ios store.</Typography>
                            <Typography component="li">Open the app and open the browser inside the app. </Typography>
                            <Typography component="li">Visit the dApp</Typography>
                            <Typography component="li">Find the connect button, and click connect</Typography>
                            <Typography component="li">Your mobile wallet app will take you from there.</Typography>
                        </Typography>
                        <Link href="/learn/sign-in/coinbase-wallet" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                            <Button sx={{ marginY: 2 }}>Coinbase Wallet QuickStart</Button>
                        </Link>
                    </Box>
                    <Box marginY={4}>
                        <Typography mt={4} mb={2} variant="h2">
                            What about Wallet Connect?
                        </Typography>
                        <Typography component="p" mb={1} color={theme => theme.palette.text.secondary}>
                            WalletConnect is an open source protocol that allows dApps to connect to mobile wallets apps with QR code scanning or deep links.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.primary}>
                            Desktop
                        </Typography>
                        <Typography component="p" mb={1} color={theme => theme.palette.text.secondary}>
                            You can select the wallet connect connect option on a dApp to connect a <strong>desktop browser to the mobile wallet</strong> app on your phone.
                        </Typography>
                        <Typography component="p" mb={1} color={theme => theme.palette.text.secondary}>
                            To do this, click the connect button on a dApp, select wallet connect, and open your mobile wallet and scan the QR code the dApp presents to you.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.primary}>
                            Mobile
                        </Typography>
                        <Typography component="p" mb={1} color={theme => theme.palette.text.secondary}>
                            You can select the wallet connect connect option on a dApp to connect a <strong>mobile browser to the mobile wallet</strong> app on your phone.
                        </Typography>
                        <Typography component="p" mb={1} color={theme => theme.palette.text.secondary}>
                            To do this, you will open your wallet app on your phone and click the connect button.
                        </Typography>
                        <Typography component="p" mb={1} color={theme => theme.palette.text.secondary}>
                            The dApp should take care of redirects between your wallet and browser; but this can sometimes be a little flakey; so you may need to switch back yourself.
                        </Typography>
                        <Typography component="p" mb={1} color={theme => theme.palette.text.secondary}>
                            Requests sent from a dApp to your wallet can sometimes get lost as well, so you may need to trigger the request from the dApp more than once.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">Signing a Message</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A dApp may authenticate you by asking you to sign a message with your wallet.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            This does not trigger a blockchain transaction; is secure; and does not cost you are money.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            It allows the dApp to look up information they have stored for your account.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Perhaps you set a nickname for your wallet address, and the dapp needs to retrieve it.
                        </Typography>
                    </Box>

                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">Can dApps access my private keys or secret recovery phrase?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Not by signing a message to log in.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            In general, DApps do not hold your keys. Hodl My Moon does not want your keys.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Signing a message to log in to Hodl My Moon does not give us access to your private key or secret recovery phrase.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            <strong>If a dApp, or anyone asks you for your secret recovery phrase (or private key) do not give it to them. They can use it to access your cryptocurrency</strong>
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">Can a dApp initiate a transaction on my behalf?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            No. Not if you do not give it your private key.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Hodl My Moon does not want your private key.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">How are transaction&apos;s initiated then?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A dApp will use JavaScript to trigger your wallet to ask you to if you&apos;d like to confirm a transaction on the blockchain.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You&apos;ll get a pop up window on a desktop, and a modal window on a mobile app.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You can confirm or reject the suggested transaction.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">And I can reject every transaction?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Yes. I&apos;m not sure why you&apos;d want to; but you can.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">When might I be asked to confirm a transaction on Hodl My Moon?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You could be asked if you&apos;d like to confirm a transaction when you need to talk to the blockchain</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Examples
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary} component="ul">
                            <li>You want to create a post (nft). Every post on our website is an nft.</li>
                            <li>You want to list or delist an nft on the marketplace.</li>
                            <li>Yout want to purchase an nft from the marketplace.</li>
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">When won&apos;t I be asked to confirm a transaction on Hodl My Moon?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Whenever you do not need to talk to the blockchain.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Examples
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary} component="ul">
                            <li>Change your nickname</li>
                            <li>Change your avatar</li>
                            <li>Follow or unfollow other users</li>
                            <li>Like a post</li>
                            <li>Comment on a post</li>
                            <li>Share a post</li>
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
