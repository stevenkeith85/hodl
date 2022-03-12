import NightlightIcon from '@mui/icons-material/Nightlight';
import { Box, Typography } from "@mui/material";
import Link from 'next/link';


export const Logo = () => (
    <Link href='/'>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            marginRight: {
                xs: 0,
            },
            justifyContent: {
                xs: 'center',
                md: 'right',
            },
            cursor: 'pointer'
        }}>
            <NightlightIcon sx={{ mr: 2 }} />
            <Typography sx={{
                fontFamily: theme => theme.logo.fontFamily,
                fontSize: theme => theme.logo.fontSize
            }}>
                Hodl My Moon
            </Typography>
        </Box>
    </Link>
)
