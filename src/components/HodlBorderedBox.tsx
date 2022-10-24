import Box from "@mui/material/Box";

interface HodlBorderedBoxProps {
    sx?: object,
}

export const HodlBorderedBox: React.FC<HodlBorderedBoxProps> = ({ sx = null, children }) => (
    <Box
        sx={{
            border: `1px solid #ddd`,
            borderRadius: 1,
            padding: 2,
            background: 'white',
            ...sx,
            
        }}
    >
        {children}
    </Box>
)