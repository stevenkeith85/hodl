import { Stack, Typography } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


export const RocketTitle = ({ title }) => (
    <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
            alignItems: 'center' 
        }}>
        <RocketLaunchIcon color="secondary" fontSize="large" />
        <Typography variant="h1">
            {title}
        </Typography>
    </Stack>
)
