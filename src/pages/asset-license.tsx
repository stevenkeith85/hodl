import { Box, Typography } from "@mui/material";
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
    return (
        <Box marginX={4} marginY={4}>
            <HodlBorderedBox>
                <Typography mb={1} sx={{ fontSize: 20, fontWeight: 600 }}>
                    Asset License
                </Typography>
                <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                    When an author mints a token, they <span>must</span> specify what the hodler can do with the attached asset. The author and hodler will initially be the same person; but the token could be traded in the future.
                </Typography>
                <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                    This information will be added to the token&apos;s metadata.
                </Typography>
                <Box marginY={4}>
                    <Typography marginY={2} variant="h2">Options</Typography>
                    <Typography>
                        You should select one of the following declarations:</Typography>
                    <Box sx={{ margin: 4 }}>
                        <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">1. No License</Typography>
                        <NoLicenseText />
                        <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">2. Non-Commercial License</Typography>
                        <NonCommercialText />
                        <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">3. Commercial License</Typography>
                        <CommercialText />
                    </Box>
                </Box>
                <Box marginY={4}>
                    <Typography variant="h2">Examples</Typography>
                    <Box marginY={4}>
                        <Typography mb={2} sx={{ fontStyle: 'italic', span: { fontWeight: 600 } }}>
                            1. <span>I'm a photographer</span>. I want to sell a stock photograph that the future hodler can use on their commercial website.
                        </Typography>
                        <Typography mb={2} sx={{ fontStyle: 'italic', span: { color: 'green' } }}>Select <span>Commercial</span>.</Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={2} sx={{ fontStyle: 'italic', span: { fontWeight: 600 } }}>
                            2. <span>I'm a musician</span>. I want to sell a token that will give entry to my next gig.
                        </Typography>
                        <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                            I attach some artwork to the token as a collectible.
                            I don't mind the hodler using the artwork for their own non-commercial purposes.
                        </Typography>
                        <Typography mb={2} sx={{ fontStyle: 'italic', span: { color: 'green' } }}>Select <span>Non-Commercial</span>.</Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={2} sx={{ fontStyle: 'italic', span: { fontWeight: 600 } }}>
                            3. <span>I'm a game designer</span>. I want to sell a token that will represent a sword in my computer game.
                        </Typography>
                        <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                            I do not want the future hodler to use the attached artwork in any way without consent.
                        </Typography>
                        <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                            The value lies with what the token gives the hodler in my game.
                        </Typography>
                        <Typography mb={2} sx={{ fontStyle: 'italic', span: { color: 'green' } }}>Select <span>No License</span>.</Typography>
                    </Box>

                </Box>
                <Box marginY={4}>
                    <Typography mb={2} variant="h2">Why do we do this?</Typography>
                    <Typography mb={2}>
                        It can help resolve any disputes on what the current hodler can do with the attached asset.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography mb={2} variant="h2">License Agreement</Typography>
                    <Typography>View the license agreement <Link href="/legal/license">here</Link></Typography>
                </Box>
            </HodlBorderedBox>
        </Box >)
}