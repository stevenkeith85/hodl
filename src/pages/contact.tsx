import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import NoSsr from '@mui/material/NoSsr';

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
                    <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                        We&apos;ll get back to you as soon as possible.
                    </Typography>
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
                        Other Enquiries
                    </Typography>
                    <NoSsr>
                        <Typography color={theme => theme.palette.text.secondary}>enquiries@hodlmymoon.com</Typography>
                    </NoSsr>
                </Box>
            </HodlBorderedBox>
        </Box>)
}
