import { Button } from "@mui/material";

export const HodlButton = ({ children, sx={}, ...props }) => (
    <Button {...props} variant="outlined" sx={{ 
        borderRadius: 1,
        paddingTop: 1, 
        paddingBottom: 1, 
        paddingLeft: 3, 
        paddingRight: 3,
        ...sx }}>
        { children }                      
    </Button>
)