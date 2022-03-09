import { Box, Alert } from "@mui/material"

const InformationBox = ({ message }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", padding: 4 }}>
            <Alert sx={{ padding: 2, fontSize: 18 }} severity="info">{message}</Alert>
        </Box>
    )
}

export default InformationBox
