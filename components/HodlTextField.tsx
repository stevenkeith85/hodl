import { TextField } from "@mui/material";

export const HodlTextField = ({ ...props }) => (
    <TextField
        InputLabelProps={{ shrink: true }}
        {...props}
    />
)
