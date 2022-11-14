import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import React from 'react';


export const TokenNameAndDescriptionLoading = () => (
    <Box
        marginBottom={2}
        sx={{
            position: 'relative',
            paddingBottom: 2,
            borderBottom: `1px solid #ddd`
        }}
    >
        <Skeleton variant="text" animation="wave">
            <Typography mb={1} sx={{ fontWeight: 600 }}>Token Name</Typography>
        </Skeleton>
        <Skeleton variant="text" animation="wave">
            <Box sx={{ whiteSpace: 'pre-line' }}>A short description of this token with some #tags</Box>
        </Skeleton>
    </Box>
)
