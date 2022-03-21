import { Button } from "@mui/material";

export const HodlButton = ({ children, sx={}, ...props }) => (
    <Button {...props} variant="outlined" sx={{ 
        textAlign: 'center', 
        paddingTop: 1, 
        paddingBottom: 1, 
        paddingLeft: 3, 
        paddingRight: 3,
        fontSize: 16,
        textTransform: 'none',
        ...sx }}>
        { children }                      
    </Button>
)