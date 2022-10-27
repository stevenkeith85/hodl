import {
    Box,
    Typography
} from "@mui/material";


import React from 'react';
import { HodlCommentsBox } from "../../components/comments/HodlCommentsBox";
import { insertTagLinks } from "../../lib/templateUtils";


const SocialTab = ({ nft, limit }) => (
    <Box
        sx={{
            background: 'white',
            padding: {
                xs: 2,
                sm: 2
            },
            border: `1px solid #ddd`
        }}>
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
        <HodlCommentsBox
            limit={limit}
            header={false}
        />
    </Box>
)

export default SocialTab;