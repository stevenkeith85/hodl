import { Stack, Typography } from "@mui/material";


export const HodlImpactAlert = ({title, message, action=null, sx=null}) => (
    <Stack 
        spacing={2}
        sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: "center", 
            textAlign: 'center', 
            justifyItems: "center", 
            // paddingTop: 8, 
            padding: 8, 
            ...sx 
        }}>
            <Typography variant="h1" color="secondary">{title}</Typography>
            <Typography>{message}</Typography>
            { action }
      </Stack>
)