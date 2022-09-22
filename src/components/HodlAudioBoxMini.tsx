import { MusicNote } from "@mui/icons-material";
import { Box } from "@mui/material";

export const HodlAudioBoxMini = ({size}) => (
    <Box sx={{
        width: size,
        height: size,
        background: theme => theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <MusicNote sx={{ color: 'white' }} />
    </Box>
)