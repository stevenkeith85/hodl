import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';


export const TokenNameAndDescriptionLoading = ({ nft }) => (
    <Box
        marginBottom={2}
        sx={{
            position: 'relative',
            paddingBottom: 2,
            borderBottom: `1px solid #ddd`
        }}
    >
        <Typography mb={1} sx={{ fontWeight: 600 }}>{nft?.name}</Typography>
        <Box sx={{ whiteSpace: 'pre-line' }}>{nft?.description}</Box>
    </Box>
)
