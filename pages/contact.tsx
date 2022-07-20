import { Box, Stack, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import { grey } from '@mui/material/colors';
import { Reddit, RocketLaunch } from "@mui/icons-material";
import { authenticate } from "../lib/jwt";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);
  
    return {
      props: {
        address: req.address || null,
      }
    }
  }

export default function Contact({ address}) {
    return (
        <Box marginY={4}>
            <Typography marginY={2} variant="h1" color="secondary">Contact</Typography>
            <Typography marginY={2}>If you reach out to us on one of the following channels, we will get back to you as soon as possible.</Typography>
            <Stack marginY={4} direction="column" spacing={2} sx={{ color: grey[600] }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <RocketLaunch />
                    <Typography>hodlmymoon</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <TwitterIcon />
                    <Typography>hodlmymoon</Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Reddit />
                    <Typography>/u/hodlmymoon</Typography>
                </Stack>
            </Stack>
        </Box>)
}