import { Stack, Typography } from "@mui/material";
import RocketIcon from '@mui/icons-material/Rocket';


export const HodlImpactAlert = ({title, message, action=null}) => (
    <Stack 
        spacing={2}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: "center", textAlign: 'center', justifyItems: "center", paddingTop: 16, paddingBottom: 16 }}>
            <RocketIcon sx={{ fontSize: 82, color: 'grey'}} />
            <Typography variant="h1" color="secondary">{title}</Typography>
            <Typography>{message}</Typography>
            { action }
      </Stack>
)