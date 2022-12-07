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

export default function WhatAreDApps({ address }) {
    const title = "What are dApps";
    const description = "Learn about decentralized applications, and why you should use them.";
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
                            What are dApps?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A dApp is a decentralized application.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            Decentralized Applications?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A decentralized application stores some of your data on a blockchain.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A centralized application stores all of your data on a database it controls.
                        </Typography>

                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            Web2 vs Web3
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A centralized application is often called a web2 enabled site.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A decentralized application is often called a web3 enabled site.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            Why should I care about dApps?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You can think of a dApp as a window to the blockchain.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            That data does not belong to the company who created the dApp. It belongs to you.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You do not have to ask a company to give you that data, and if the company goes out of business your data does not disappear.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            You said only some of my data is stored on a blockchain?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Yes. Not everything makes sense to store on the blockchain.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            For example, if you want to &quot;like an NFT&quot; on Hodl My Moon; we store that &quot;like&quot; in a tradional database.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            The reason is that storing something on the blockchain takes a few seconds and incurs a small transaction fee.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Do you really want to wait longer and pay a cent every time you &quot;like&quot; something?
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            DApps allow us to Mint NFTs I guess?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Yes. Using a DApp, like Hodl My Moon, will allow you to mint, buy, or sell polygon nfts.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            And the NFTs I mint belong to me; not the DApp?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Yes. As long as you&apos;ve actually minted the NFT then it is yours
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Some platforms are &quot;gas less&quot;, which means they don&apos;t actually mint the NFT until someone buys it.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            This means your data isn&apos;t actually on the blockchain at this point.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            Hodl My Moon isn&apos;t gas less?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            We are not gas less.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            We ensure your NFT is minted on the polygon blockchain at creation time.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Gas costs about a cent, and the transactions are very fast with Polygon.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Gas less became popular, as ethereum (another blockchain) had extortionate gas fees, and creators were willing to temporarily give up decentralization to save money.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Polygon is exceptionally cheap, so we see no reason to give up decentralization here.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            So dApps are the future then?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            We think dApps are the present. There is a tremendous growth in this area.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography component="h2" mb={1} sx={{ fontSize: 16, fontWeight: 500 }}>
                            And how do I interact or connect to a dApp?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You can read how to connect with decentralized applications right here on Hodl My Moon
                        </Typography>
                        <Box display='flex' gap={2}>
                            <Link href="/learn/dapps/interact-with-dapps" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                                <Button sx={{ marginY: 2 }}>Interact With Dapps</Button>
                            </Link>
                            <Link href="/learn/" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                                <Button sx={{ marginY: 2 }}>NFT and DApp learning hub</Button>
                            </Link>
                        </Box>

                    </Box>
                </HodlBorderedBox>
            </Box>
        </>
    )
}
