import { Box, NoSsr, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import { grey } from '@mui/material/colors';
import { RocketLaunch } from "@mui/icons-material";
import { authenticate } from "../lib/jwt";
import { HodlBorderedBox } from "../components/HodlBorderedBox";
import { TikTokIcon } from "../components/TikTokIcon";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    return {
        props: {
            address: req.address || null,
        }
    }
}

export default function Contact({ address }) {
    return (
        <Box marginX={2} marginY={4}>
            <HodlBorderedBox>
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                        Contact Us
                    </Typography>
                    <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                        We&apos;ll get back to you as soon as possible.
                    </Typography>
                </Box>
                <Box mb={4}>
                    <Typography
                        variant="h2"
                        mb={2}
                    >
                        Socials
                    </Typography>
                    <Box sx={{
                        display: 'grid',
                        gap: 2
                    }}>
                        <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
                            <RocketLaunch sx={{ color: grey[500] }} />
                            <Typography color={theme => theme.palette.text.secondary}>hodlmymoon</Typography>
                        </Box>
                        <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
                            <TwitterIcon sx={{ color: grey[500] }} />
                            <Typography color={theme => theme.palette.text.secondary}>hodlmymoon</Typography>
                        </Box>
                        <Box sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 24, height: 24 }}>
                                <TikTokIcon color={grey[500]} />
                            </Box>
                            <Typography color={theme => theme.palette.text.secondary}>hodlmymoon</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box mb={4}>
                    <Typography
                        variant="h2"
                        mb={1}
                    >
                        Support
                    </Typography>
                    <Typography>
                        <NoSsr>
                            <Typography color={theme => theme.palette.text.secondary}>support@hodlmymoon.com</Typography>
                        </NoSsr>
                    </Typography>
                </Box>
                <Box mb={4}>
                    <Typography
                        variant="h2"
                        mb={1}
                    >
                        Other
                    </Typography>
                    <NoSsr>
                        <Typography color={theme => theme.palette.text.secondary}>enquiries@hodlmymoon.com</Typography>
                    </NoSsr>
                </Box>
            </HodlBorderedBox>
        </Box>)
}