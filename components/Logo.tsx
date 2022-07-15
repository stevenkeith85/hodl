import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Typography, Stack } from "@mui/material";
import Link from 'next/link';

export const Logo = ({ sx = {} }) => (
    <Link href="/" passHref>
        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
                cursor: 'pointer',
                ...sx
            }}
        >
            <RocketLaunchIcon 
                // sx={{ fontSize: '35px'}} 
            />
            {/* <Typography
                sx={{
                    fontFamily: theme => theme.logo.fontFamily,
                    fontSize: theme => theme.logo.fontSize
                }}>
                Hodl My Moon
            </Typography> */}
        </Stack>
    </Link>
)
