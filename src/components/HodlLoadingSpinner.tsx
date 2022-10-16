import { Box, CircularProgress } from "@mui/material";

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