import { Box, CircularProgress } from "@mui/material";

export const HodlLoadingSpinner = () => (
    <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}><CircularProgress color="secondary"/></Box>
)