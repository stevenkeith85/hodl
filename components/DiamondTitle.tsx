import { Typography, Stack } from '@mui/material'
import DiamondIcon from '@mui/icons-material/Diamond';

export const DiamondTitle = ({ title }) => (
    <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
            alignItems: 'center' 
        }}
    >
        <DiamondIcon color="secondary" fontSize="large" />
        <Typography variant="h1">{title}</Typography>
    </Stack>
)
