import { Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { SatelliteAlt } from "@mui/icons-material";


export const HodlImpactAlert = ({title, message, action=null, sx=null}) => (
    <Stack 
        spacing={2}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: "center", textAlign: 'center', justifyItems: "center", paddingTop: 16, paddingBottom: 16, ...sx }}>
            <SatelliteAlt sx={{ fontSize: 82, color: grey[400], margin: 4}} />
            <Typography variant="h1" color="secondary">{title}</Typography>
            <Typography>{message}</Typography>
            { action }
      </Stack>
)