import { Box } from "@mui/material";

export const HodlBorderedBox = ({ sx, children }) => (
    <Box
        sx = {{
            border: `1px solid #ddd`,
            borderRadius: 1,
            padding: 2,
            ...sx
        }}
    >
        { children }
    </Box>
)