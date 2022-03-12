import { Button } from "@mui/material";

export const HodlButton = ({ children, ...props }) => (
    <Button {...props} variant="outlined" sx={{ padding: 1, textAlign: 'center' }}>
        { children }                      
    </Button>
)