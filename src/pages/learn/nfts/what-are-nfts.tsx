import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import MoneyIcon from '@mui/icons-material/Money';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import { HodlBorderedBox } from "../../../components/HodlBorderedBox";
import { authenticate } from "../../../lib/jwt";
import { indigo } from "@mui/material/colors";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    return {
        props: {
            address: req.address || null,
        }
    }
}

const Comparison = ({ item1, item2 }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }}>
        {item1}
        vs
        {item2}
    </div>
)

export default function WhatAreNFTs({ address }) {
    const title = "What are NFTs";
    const description = "Learn what non fungible tokens are, and avoid the pitfalls";

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            <Box
                marginX={2}
                marginY={4}
            >
                <HodlBorderedBox>
                    <Box mb={4}>
                        <Typography component="h1" mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            What are NFTs?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                            Non Fungible Tokens are digital assets with their ownership recorded on a digital ledger.
                        </Typography>
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">What does Fungible Mean?</Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            Fungibile is a synonym for substituable.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            If I have one bitcoin, and you have one bitcoin, we can swap them and neither of us has gained or lost anything. (<strong>fungible</strong>)
                        </Typography>
                        <Comparison
                            item1={<CurrencyBitcoinIcon color="primary" sx={{ fontSize: '100px' }}></CurrencyBitcoinIcon>}
                            item2={<CurrencyBitcoinIcon color="primary" sx={{ fontSize: '100px' }}></CurrencyBitcoinIcon>}
                        />
                        <Typography mt={2} mb={1} color={theme => theme.palette.text.secondary}>
                            If I have a Charmander, and you have a Pikachu then you may not wish to swap. (<strong>non fungible</strong>)
                        </Typography>
                        <Comparison
                            item1={<img height="100" src="/004.png"></img>}
                            item2={<img height="100" src="/025.png"></img>}
                        />
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">What do we mean by Token?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            A token is a digital representation of an asset.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            I could hold a dollar bill in my hand, or it could be represented as an entry in a database.
                        </Typography>
                        <Comparison
                            item1={<MoneyIcon color="secondary" sx={{ fontSize: 100 }}></MoneyIcon>}
                            item2={<StorageIcon color="inherit" sx={{ fontSize: 100 }}></StorageIcon>}
                        />
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">What are Non Fungible Tokens then?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            As we mentiond, <strong>NFTs are digital assets with their ownership recorded on a digital ledger.</strong>
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            One type of digital ledger is a blockchain. A blockchain is a globally shared database.
                        </Typography>
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">On chain vs off chain</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Only the address of the owner and a <strong>link</strong> to the asset&apos;s metadata are stored on the blockchain. (<strong>on chain</strong>)
                        </Typography>
                        <Typography mb={2} color={theme => theme.palette.text.secondary}>
                            The metadata is not stored on the blockchain. (<strong>off chain</strong>)
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Off chain data should be stored on a decentralized server to ensure the long term survivability of it.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You wouldn&apos;t want the host of your metadata to go out of business, as you&apos;d lose your asset.
                        </Typography>
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">What exactly is Metadata?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Metadata describes the nft. It includes a name, description, and an image; but can have other attributes as well.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            NFT Metadata is stored in a format called JSON. This is plain text format and is somewhat readable once you get used to it.
                        </Typography>
                        <DataObjectIcon color="primary" sx={{ fontSize: 100 }}></DataObjectIcon>
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">What blockchains support NFTs?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            There are many blockchains. Some better known ones include Bitcoin, Ethereum, and Polygon.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Not every blockchain can support NFTS. You should know which blockchain your NFT is minted on.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            All NFTs created on Hodl My Moon are <a target="_blank" href="/explore">Polygon NFTs</a>
                        </Typography>
                        <Box sx={{
                            backgroundColor: indigo,
                            width: '200px',
                            marginY: 3
                        }}>
                            <img src="/polygon-logo.svg" alt="polygon logo" />
                        </Box>

                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">Where can I mint NFTs and start my journey?</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You can download a web3 wallet, and log in right here.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Once you&apos;ve logged in, you can mint your first Polygon NFT on the site.
                        </Typography>
                        <Link href="/learn/sign-in/coinbase-wallet" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                            <Button sx={{ marginY: 2 }}>Coinbase Wallet Quickstart</Button>
                        </Link>
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Hodl My Moon is an <a target="_blank" href="/">Polygon NFT Marketplace and Social Network</a>
                        </Typography>
                    </Box>
                    <Box marginY={5}>
                        <Typography mb={1} variant="h2">References</Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            <Link target="_blank" href="https://www.pokemon.com/">Pokemon</Link>
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            <Link target="_blank" href="https://polygon.technology/">Polygon</Link>
                        </Typography>
                        <Link href="/learn/" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                            <Button sx={{ marginY: 2 }}>NFT and DApp learning hub</Button>
                        </Link>
                    </Box>

                </HodlBorderedBox>
            </Box >
        </>
    )
}
