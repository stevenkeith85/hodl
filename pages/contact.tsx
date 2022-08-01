import { Box, Stack, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import { grey } from '@mui/material/colors';
import { Reddit, RocketLaunch } from "@mui/icons-material";
import { authenticate } from "../lib/jwt";
import { ContactPagePitch } from "../components/layout/ContactPagePitch";

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
        <Box marginY={4} textAlign="center">
            <ContactPagePitch />
            <Stack direction="column" spacing={4} sx={{ color: grey[600], alignItems: "center" }}>
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