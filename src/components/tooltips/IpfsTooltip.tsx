import { Box, Typography } from "@mui/material";

export const IpfsTooltip = () => (
    <Box padding={2}>
        <Typography mb={1}>
            The Inter Planetary File System
        </Typography>
        <Typography mb={1}>
            IPFS is a distributed file system.
        </Typography>
        <Typography mb={1}>
            It uses content-addressing to uniquely identify each file.
        </Typography>
    </Box>

)