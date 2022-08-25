import { Box, Tooltip, Typography } from '@mui/material'
import { getShortAddress } from '../lib/utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';

export const CopyAddress = ({ owner }) => {

    const [copied, setCopied] = useState(false);

    return (
        <CopyToClipboard 
            text={owner.address}
            onCopy={() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000)
            }}
            >
                    <Tooltip title={copied ? "Copied!": "Copy"} arrow={true}>
                    <Box component="span" sx={{ cursor: 'pointer'}}>{getShortAddress(owner.address)}</Box>
                    </Tooltip>
                </CopyToClipboard>
    )
}