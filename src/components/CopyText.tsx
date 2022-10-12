import { Box, Tooltip, Typography } from '@mui/material'
import { getShortAddress } from '../lib/utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';

export const CopyText = ({ text, children }) => {
    const [copied, setCopied] = useState(false);

    return (
        <CopyToClipboard
            text={text}
            onCopy={() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000)
            }}
        >
            <Tooltip title={copied ? "Copied!" : "Copy"} arrow={true}>
                <Box component="span" sx={{ cursor: 'pointer' }}>
                    { children }
                </Box>
            </Tooltip>
        </CopyToClipboard>
    )
}