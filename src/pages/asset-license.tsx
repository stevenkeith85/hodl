import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Head from "next/head";

import Link from "next/link";

import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { CommercialText } from "../components/tooltips/CommercialTooltip";
import { NonCommercialText } from "../components/tooltips/NonCommercialTooltip";
import { NoLicenseText } from "../components/tooltips/TokenOnlyTooltip";
import { authenticate } from "../lib/jwt";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    return {
        props: {
            address: req.address || null,
        }
    }
}

export default function AssetLicense({ address }) {
    const title = "When you buy an nft what do you get";
    const description = "Read about how our asset license removes any ambiguity about what hodlers receive when they buy an NFT";

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            <Box marginX={2} marginY={4}>
                <HodlBorderedBox>
                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                        Asset License
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                        When an author mints a token, they <span>must</span> specify what the hodler can do with the attached asset. The author and hodler will initially be the same person; but the token could be traded in the future.
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                        This information will be added to the token&apos;s metadata.
                    </Typography>
                    <Box marginY={4}>
                        <Typography mb={1} variant="h2">Options</Typography>
                        <Typography color={theme => theme.palette.text.secondary}>
                            You should select one of the following declarations:</Typography>
                        <Box sx={{ marginY: 4 }}>
                            <Typography
                                sx={{
                                    marginTop: 4,
                                    marginBottom: 2,
                                    color: theme => theme.palette.primary.main
                                }}
                                variant="h3">
                                1. No License
                            </Typography>
                            <NoLicenseText />
                            <Typography
                                sx={{
                                    marginTop: 4,
                                    marginBottom: 2,
                                    color: theme => theme.palette.primary.main
                                }}
                                variant="h3">
                                2. Non-Commercial License
                            </Typography>
                            <NonCommercialText />
                            <Typography
                                sx={{
                                    marginTop: 4,
                                    marginBottom: 2,
                                    color: theme => theme.palette.primary.main
                                }}
                                variant="h3">3. Commercial License</Typography>
                            <CommercialText />
                        </Box>
                    </Box>
                    <Box
                        marginY={4}
                    >
                        <Typography variant="h2" mb={2}>Examples</Typography>
                        <Box mb={4}>
                            <Typography
                                color={theme => theme.palette.text.secondary}
                                mb={2}
                                sx={{ fontStyle: 'italic', span: { fontWeight: 500 } }}>
                                1. <span>I&apos;m a photographer</span>. I want to sell a stock photograph that the future hodler can use on their commercial website.
                            </Typography>
                            <Typography mb={2} sx={{ fontStyle: 'italic', span: { color: 'green' } }}>Select <span>Commercial</span>.</Typography>
                        </Box>
                        <Box marginY={4}>
                            <Typography
                                color={theme => theme.palette.text.secondary}
                                mb={2}
                                sx={{ fontStyle: 'italic', span: { fontWeight: 500 } }}>
                                2. <span>I&apos;m a musician</span>. I want to sell a token that will give entry to my next gig.
                            </Typography>
                            <Typography
                                color={theme => theme.palette.text.secondary}
                                mb={2}
                                sx={{ fontStyle: 'italic' }}>
                                I attach some artwork to the token as a collectible.
                                I don&apos;t mind the hodler using the artwork for their own non-commercial purposes.
                            </Typography>
                            <Typography mb={2} sx={{ fontStyle: 'italic', span: { color: 'green' } }}>Select <span>Non-Commercial</span>.</Typography>
                        </Box>
                        <Box marginY={4}>
                            <Typography
                                color={theme => theme.palette.text.secondary}
                                mb={2}
                                sx={{ fontStyle: 'italic', span: { fontWeight: 600 } }}>
                                3. <span>I&apos;m a game designer</span>. I want to sell a token that will represent a sword in my computer game.
                            </Typography>
                            <Typography
                                color={theme => theme.palette.text.secondary}
                                mb={2}
                                sx={{ fontStyle: 'italic' }}>
                                I do not want the future hodler to use the attached artwork in any way without consent.
                            </Typography>
                            <Typography
                                color={theme => theme.palette.text.secondary}
                                mb={2}
                                sx={{ fontStyle: 'italic' }}>
                                The value lies with what the token gives the hodler in my game.
                            </Typography>
                            <Typography mb={2} sx={{ fontStyle: 'italic', span: { color: 'green' } }}>Select <span>No License</span>.</Typography>
                        </Box>

                    </Box>
                    <Box marginY={4}>
                        <Typography mb={2} variant="h2">License Agreement</Typography>
                        <Typography color={theme => theme.palette.text.secondary}>View the license agreement <Link href="/legal/license">here</Link></Typography>
                    </Box>
                </HodlBorderedBox>
            </Box >
        </>
    )
}