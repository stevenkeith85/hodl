import { Box, Alert } from '@mui/material'

export const ConnectWallet = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", padding: 4 }}>
        <Alert sx={{ padding: 2, fontSize: 18 }} severity="info">Please connect your wallet</Alert>
    </Box>
)
