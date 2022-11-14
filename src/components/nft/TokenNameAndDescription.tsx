import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

import { insertTagLinks } from "../../lib/templateUtils";

export const TokenNameAndDescription = ({ nft }) => (
    <Box
        marginBottom={2}
        sx={{
            position: 'relative',
            paddingBottom: 2,
            borderBottom: `1px solid #ddd`
        }}
    >
        <Typography mb={1} sx={{ fontWeight: 600 }}>{nft.name}</Typography>
        <Box sx={{ whiteSpace: 'pre-line' }}>{insertTagLinks(nft.description)}</Box>
    </Box>
)