import Box from "@mui/material/Box";
import MusicNoteIcon from '@mui/icons-material/MusicNote';


export const HodlAudioBoxMini = ({size}) => (
    <Box sx={{
        width: size,
        height: size,
        background: theme => theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <MusicNoteIcon sx={{ color: 'white' }} />
    </Box>
)