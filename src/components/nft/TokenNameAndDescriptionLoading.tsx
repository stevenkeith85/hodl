import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
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
        <Skeleton variant="text" width={100}></Skeleton>
        <Skeleton variant="text" width={200}></Skeleton>
    </Box>
)
