import { Box } from "@mui/material";

interface HodlBorderedBoxProps {
    sx?: object,
}

export const HodlBorderedBox: React.FC<HodlBorderedBoxProps> = ({ sx=null, children }) => (
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