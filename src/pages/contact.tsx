import { Box, NoSsr, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import { grey } from '@mui/material/colors';
import { RocketLaunch } from "@mui/icons-material";
import { authenticate } from "../lib/jwt";
import { HodlBorderedBox } from "../components/HodlBorderedBox";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    return {
        props: {
            address: req.address || null,
        }
    }
}

const TikTokIcon = ({ color = "#000000" }) => {
    return (
        <svg
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="100%"
            height="100%"
        >
            <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
        </svg>
    );
};

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