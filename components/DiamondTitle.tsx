import { Typography, Stack } from '@mui/material'

export const DiamondTitle = ({ title }) => (
    <Stack 
        direction="row-reverse" 
        spacing={1} 
        sx={{ 
            alignItems: 'center' 
        }}
    >
        <Typography variant="h1" 
            sx={{ 
                textTransform: 'uppercase', 
                color: (theme) => theme.palette.secondary.main, 
                fontSize: 14, 
                fontWeight: 500,
                borderBottom: (theme) => 'transparent',//`2px solid ${theme.palette.secondary.main}`,
                display: 'inline-block',
                padding: '12px 16px'}}>{title}</Typography>
    </Stack>
)
