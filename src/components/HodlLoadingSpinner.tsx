import { Box, CircularProgress } from "@mui/material";

export const HodlLoadingSpinner = ({ sx = {}, ...rest }) => (
    <Box
        sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            ...sx
        }}>
        <CircularProgress
            size={24}
            color="secondary"
        />
    </Box>
)