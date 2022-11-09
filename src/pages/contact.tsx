import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import NoSsr from '@mui/material/NoSsr';
import Link from '@mui/material/Link';

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

export default function Contact({ address }) {
    return (
        <Box marginX={2} marginY={4}>
            <HodlBorderedBox>
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                        Contact
                    </Typography>
                    <Typography color={theme => theme.palette.text.secondary}>
                        Thanks for reaching out. We&apos;ll get back to you as soon as possible.
                    </Typography>
                </Box>
                <Box mb={4}>
                    <Typography
                        variant="h2"
                        mb={1}
                    >
                        Email
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
                        Socials
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link href="https://www.hodlmymoon.com/profile/hodlmymoon/" sx={{ color: theme => theme.palette.text.secondary, textDecoration: 'none' }}>Hodl My Moon</Link>
                        <Link href="https://twitter.com/hodlmymoon" sx={{ color: theme => theme.palette.text.secondary, textDecoration: 'none' }}>Twitter</Link>
                        <Link href="https://www.facebook.com/profile.php?id=100086969439067" sx={{ color: theme => theme.palette.text.secondary, textDecoration: 'none' }}>Facebook</Link>
                        <Link href="https://www.reddit.com/user/hodlmymoon1/" sx={{ color: theme => theme.palette.text.secondary, textDecoration: 'none' }}>Reddit</Link>
                        <Link href="https://www.linkedin.com/company/hodlmymoon/" sx={{ color: theme => theme.palette.text.secondary, textDecoration: 'none' }}>LinkedIn</Link>
                    </div>
                </Box>
            </HodlBorderedBox>
        </Box>)
}
