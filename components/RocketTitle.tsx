import { Stack, Typography } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


export const RocketTitle = ({ title }) => (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <RocketLaunchIcon color="secondary" fontSize="large" />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {title}
        </Typography>
    </Stack>
)
