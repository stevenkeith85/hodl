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

    const title = "About Hodl My Moon";
    const description = "Learn about Hodl My Moon, and why you should join us today."

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
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            About Hodl My Moon
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Hodl My Moon is a Social NFT Platform. Make Frens; Mint NFTs on the Polygon blockchain; or list on our NFT Marketplace.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            What makes Hodl My Moon different?
                        </Typography>
                        <Typography component="ul">
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                Your community and marketplace are in the same place.
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                Unlike web2 social media, your immediately own your social posts. They are in your wallet.
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                You can create an NFT and see it on the blockchain in less than a minute.
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                You do not need any technical knowledge to use the platform.
                            </Typography>
                            <Typography component="li" mb={1} color={theme => theme.palette.text.secondary}>
                                We are also much faster than other DApps you may have used.
                            </Typography>
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Joining
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Users sign in with their crypto wallet to create their profile. This is quick, easy, and crytographically secure.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Social Interactions
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Users can follow other NFT artists to see their content in their feed. Liking or commenting on NFTs does not trigger blockchain transactions.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Posting / Minting NFTs.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Every post on HodlMyMoon is a Polygon NFT.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Users mint their posts via the website. They can add filters, or crop the asset. The metadata is uploaded to IPFS, a decentralized file system.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            The process quick, easy and requires no technical knowledge.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Polygon / Matic
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            NFTs are minted on the Polygon Blockchain
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            To confirm a transaction on the blockchain requires paying a tiny amount of Matic. (less than a cent). Hodl My Moon does not receive this fee.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Obtaining Matic is very easy to do. You can now buy directly from most wallets with your bank card.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            Other options include: asking frens, or transferring from an exchange.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Who owns the NFTs?
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            The users do!
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            This is why we ask the users to mint them at post time.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You, the user, are free to do whatever you want with that NFT.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            As posts are on the blockchain; any other platform you join will be able to retrieve them for you.
                        </Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Where can I learn about NFTs and DApps?
                        </Typography>

                        <Typography mb={1} color={theme => theme.palette.text.secondary}>
                            You can <Link href="/learn">learn about NFTs and DApps</Link> on Hodl My Moon.
                        </Typography>
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
