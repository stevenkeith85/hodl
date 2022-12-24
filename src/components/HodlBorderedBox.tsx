import Box from "@mui/material/Box";

interface HodlBorderedBoxProps {
    sx?: object,
    children: React.ReactNode
}

export const HodlBorderedBox: React.FC<HodlBorderedBoxProps> = ({ sx = null, children }) => (
    <Box
        sx={{
            border: `1px solid #eee`,
            // boxShadow: '1px 1px 8px #eee',
            borderRadius: 1,
            padding: 2,
            background: 'white',
            ...sx,
            
        }}
    >
        {children}
    </Box>
)