import { Box, CircularProgress } from "@mui/material";

export const HodlLoadingSpinner = ({sx={}}) => (
    <Box sx={{ padding: 2, display: "flex", justifyContent: "center", ...sx }}><CircularProgress color="secondary"/></Box>
)