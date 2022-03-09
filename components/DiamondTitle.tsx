import { Typography, Stack } from '@mui/material'
import DiamondIcon from '@mui/icons-material/Diamond';

export const DiamondTitle = ({ title }) => (
    <Stack direction="row" spacing={1} sx={{ color: (theme) => `${theme.palette.grey[600]}` }}>
        <DiamondIcon />
        <Typography variant="h1">{title}</Typography>
    </Stack>
)
