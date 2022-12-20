import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

import { insertTagLinks } from "../../lib/templateUtils";

export const TokenNameAndDescription = ({ token }) => (
    <Box>
        <Typography
            component="h1"
            sx={{
                fontSize: 16,
                fontWeight: 500,
                padding: 0,
                marginBottom: 1
            }}>
            {token.name}
        </Typography>
        <Box
            sx={{
                fontSize: 14,
                whiteSpace: 'pre-line',
                color: theme => theme.palette.text.secondary
            }}>
            {
                insertTagLinks(token.description)
            }
        </Box>
    </Box>
)
