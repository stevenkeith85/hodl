import { Box, Stack, Typography } from "@mui/material";
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { grey } from '@mui/material/colors';


export default function Contact() {
    return (
        <Box marginY={4}>
        <Stack spacing={4}>
        <Box>
        <Typography mb={2} variant="h1" color="secondary">Contact</Typography>
        <Typography mb={1}>
            Please get in touch with us via one of our social media channels:
        </Typography>
        <Stack py={4} direction="column" spacing={2} sx={{ color: grey[600]}}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center'}}>
                <LinkedInIcon/> 
                <Typography>HodlMyMoon</Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center'}}>
                <TwitterIcon/>
                <Typography>@HodlMyMoon</Typography>
            </Stack>
            
        </Stack>
        </Box>
    </Stack>
    </Box>)
}