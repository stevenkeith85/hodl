import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";


export const HodlLoadingSpinner = ({ sx = {}, size = 20 }) => (
    <Box
        sx={{
            ...sx
        }}>
        <CircularProgress
            size={size}
            color="secondary"
        />
    </Box>
)
