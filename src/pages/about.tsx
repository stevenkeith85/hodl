import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { UserAvatarAndHandle } from "../components/avatar/UserAvatarAndHandle";

import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { useUser } from "../hooks/useUser";
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
    const { data: steve } = useUser("steve");
    const { data: dug } = useUser("dug");

    const title = "About Hodl My Moon"
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Box
                marginX={2}
                marginY={4}
            >
                <HodlBorderedBox>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            About
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Hodl My Moon is a Web3 Social Network, and NFT Marketplace. NFTs are minted on Polygon.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Joining
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Users sign in with their MetaMask wallet to create a profile. This is quick, easy, and crytographically secure.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Social Interactions
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Users can follow other NFT artists; and like and comment on their posts. This does not trigger a blockchain transaction and is 100% free.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Posting / Minting NFTs.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Every post on HodlMyMoon is an NFT.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Users mint their posts via the website.The process is quick and easy and requires no technical knowledge.
                        </Typography>


                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Polygon / Matic
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Posts are minted on the Polygon Blockchain
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            To confirm a transaction on the blockchain requires paying a tiny amount of Matic. (fractions of a penny). Hodl My Moon does not receive this fee.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Users can obtain Matic from wherever they like. Directly from MetaMask, via an exchange, or just ask a friend to transfer them some.
                        </Typography>

                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Who owns the NFTs
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            The users do!
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            This is why we ask the users to mint them at post time.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You, the user, are free to do whatever you want with that NFT. (e.g. Cross sharing it as an Instagram digital collectable is common.)
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            What makes you different
                        </Typography>
                        <Typography component="ul">
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                Our website is very fast and easy to use. No technical knowledge required!
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                Your community is where you mint. It&apos;s a very social place.
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                We have an integrated marketplace
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                We have plans to allow user&apos;s to earn without having to sell their NFTs.
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                Minting an NFT is fast and easy.  (You can add filters to your images, and crop them directly on the website)
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                Our Metadata is frozen and always uploaded to IPFS, which is a decentralized and content addressed file system.
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                We ask user&apos;s to pick a license for the asset attached to the token at mint time; and write this information into the metadata.
                            </Typography>
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Where can I learn about web3 and hodl my moon?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            We have a learning hub that we are expanding...
                        </Typography>
                        <Link href="/learn" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                            <Button sx={{ marginY: 2 }}>Take Me To The Knowledge</Button>
                        </Link>
                    </Box>
                    <Box marginY={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography mb={2} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Meet Hodl My Moon
                        </Typography>

                        <Box sx={{ display: 'grid', gap: 4 }}>

                            <div>
                                <UserAvatarAndHandle fallbackData={steve} address={steve?.address} size={70} fontSize={18} />
                            </div>
                            <Box mb={2}>
                                <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                                    Founder and Lead Developer
                                </Typography>
                                <Typography mb={1} color={theme => theme.palette.text.secondary}>
                                    Steve has been writing software for a long time now. He graduated with an MEng in Software Engineering (distinction) from Heriot-Watt University in Scotland.
                                </Typography>
                                <Typography mb={1} color={theme => theme.palette.text.secondary}>
                                    Since then, he&apos;s worked with many organisations such as Skyscanner, Coats, and Standard Life Aberdeen.
                                </Typography>
                                <Link href="https://www.linkedin.com/in/stevenkeith85/" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                                    <Button sx={{ marginY: 2 }}>View LinkedIn Profile</Button>
                                </Link>
                            </Box>
                            <div>
                                <UserAvatarAndHandle fallbackData={dug} address={dug?.address} size={70} fontSize={18} />
                            </div>
                            <Box mb={2}>
                                <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                                    Director of Photography
                                </Typography>
                                <Typography mb={1} color={theme => theme.palette.text.secondary}>
                                    Dug has never written software. He doesn&apos;t really know how technology works either.
                                </Typography>
                                <Typography mb={1} color={theme => theme.palette.text.secondary}>
                                    He understands that &quot;looks&quot; are all that matters in life; and that humans seem to think he looks good. If his looks fail him; he plans to go back to offering &quot;big big paw&quot; for a biscuit instead.
                                </Typography>
                                <Link href="https://www.instagram.com/dug_keith/" sx={{ color: theme => theme.palette.primary.main, textDecoration: 'none' }}>
                                    <Button sx={{ marginY: 2 }}>View Instagram Profile</Button>
                                </Link>
                            </Box>
                            <Box mb={4}>
                                <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                                    Other
                                </Typography>
                                <Typography mb={1} color={theme => theme.palette.text.secondary}>
                                    Team profiles coming soon
                                </Typography>
                            </Box>
                        </Box>

                    </Box>

                </HodlBorderedBox>
            </Box >
        </>
    )
}
