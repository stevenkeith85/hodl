import { AccountBalanceWallet, CircleOutlined, Nightlife, NightlightOutlined, RocketLaunchRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { AboutPagePitch } from "../components/layout/AboutPagePitch";
import { CommercialText } from "../components/tooltips/CommercialTooltip";
import { NonCommercialText } from "../components/tooltips/NonCommercialTooltip";
import { TokenOnlyText } from "../components/tooltips/TokenOnlyTooltip";
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
                        Hodler Privilege
                    </Typography>
                <Typography mb={2} sx={{ span: { fontWeight: 600 } }}>
                    When an author mints an NFT, they <span>must</span> specify what any future hodler 
                    can do with the attached asset.
                </Typography>
                <Typography>You should select one of the following declarations:</Typography>
                <Box sx={{ margin: 4 }}>
                    <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">1. Token Only</Typography>
                    <TokenOnlyText />
                    <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">2. Non Commercial</Typography>
                    <NonCommercialText />
                    <Typography sx={{ marginTop: 4, marginBottom: 2, color: theme => theme.palette.primary.main }} variant="h3">3. Commercial</Typography>
                    <CommercialText />
                </Box>
                <Box marginY={4}>
                    <Typography marginY={2} variant="h2" sx={{ fontWeight: 600 }}>Examples</Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        1. I'm a photographer. I want to sell a stock photograph that the future hodler can use on their website; mugs; tshirts; etc*
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>I select "Commercial".</Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        2. I'm a musician. I want to sell a token that will give entry to my next gig.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        I attach some artwork to the token as a collectible.
                        I do not care if or where the hodler displays the attached artwork;*
                        but I do not want them using the artwork to make money.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>I select "Non Commercial".</Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic' }}>
                        3. I'm a game designer. I want to sell a token that will represent a sword in my computer game.
                        I do not want the future hodler to use the artwork in any way without consent.
                        The value only lies with what the token provides to the hodler in my game.
                    </Typography>
                    <Typography mb={2} sx={{ fontStyle: 'italic', color: 'green' }}>I select "Token Only".</Typography>
                    <Typography><Link href="/legal/license">View the license agreement</Link></Typography>
                    <Typography marginY={2}>*reasonable usage restrictions apply</Typography>
                </Box>
                <Typography mb={2} variant="h2" sx={{ fontWeight: 600 }}>Why do we do this?</Typography>
                <Typography mb={2}>
                    It can help resolve any future disputes on what the current hodler can do with the attached asset.
                </Typography>
            </HodlBorderedBox>
        </Box >)
}