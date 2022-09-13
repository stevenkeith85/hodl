import { AccountBalanceWallet, CircleOutlined, Nightlife, NightlightOutlined, RocketLaunchRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { AboutPagePitch } from "../components/layout/AboutPagePitch";
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

export default function HodlerPrivilege({ address }) {
    return (
        <Box marginX={8} marginY={4}>
            <HodlBorderedBox>
                <Typography
                    variant="h1"
                    mb={1}
                    sx={{ fontSize: 20 }}
                >
                    Asset License
                </Typography>
                <Typography mb={2} sx={{ span: { fontWeight: 600 } }}>
                    When an author mints a token, they <span>must</span> specify what the hodler can do with the attached asset. 
                    The author and hodler will initially be the same person; but the token could be traded in the future.
                    This information will be added to the token&apos;s metadata.
                </Typography>
                <Typography>You should select one of the following declarations:</Typography>
                <Box sx={{ margin: 4 }}>
                    <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">1. No License</Typography>
                    <NoLicenseText />
                    <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">2. Non Commercial License</Typography>
                    <NonCommercialText />
                    <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">3. Commercial License</Typography>
                    <CommercialText />
                </Box>
                <Box marginY={4}>
                    <Typography marginY={2} variant="h2" sx={{ fontWeight: 600 }}>Examples</Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        1. I'm a photographer. I want to sell a stock photograph that the future hodler can use on their commercial website.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>Select "Commercial".</Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        2. I'm a musician. I want to sell a token that will give entry to my next gig.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        I attach some artwork to the token as a collectible.
                        I don't mind the hodler using the artwork for their own non-commercial purposes.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>Select "Non Commercial".</Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        3. I'm a game designer. I want to sell a token that will represent a sword in my computer game.
                        I do not want the future hodler to use the artwork in any way without consent.
                        The value lies with what the token provides to the hodler in my game.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>Select "No License".</Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        4. I've just got a cool image that I'd rather upload here, than web2 platforms. I may / may not wish to sell it in the future.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>
                        Select "Commercial" if you'd be happy for the future hodler to use it in a commercial setting or;
                        "Non Commercial" if you wouldn't be happy for it to be used in a commercial setting.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>
                        Bear in mind, that allowing the asset attached to your token to be used in a commercial setting is likely to make it more valuable;
                        and there's never an obligation to sell.
                    </Typography>
                </Box>
                <Box marginY={4}>
                    <Typography marginY={2} variant="h2" sx={{ fontWeight: 600 }}>License Agreement</Typography>
                    <Typography>View the license agreement <Link href="/legal/license">here</Link></Typography>
                </Box>
                <Typography mb={2} variant="h2" sx={{ fontWeight: 600 }}>Why do we do this?</Typography>
                <Typography mb={2}>
                    It can help resolve any disputes on what the current hodler can do with the attached asset.
                </Typography>
            </HodlBorderedBox>
        </Box >)
}