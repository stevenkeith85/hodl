import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export const CopyText = ({ 
    text, 
    placement="top" as "top" | "right" | "bottom" | "left" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "right-end" | "right-start" | "top-end" | "top-start", 
    children 
}) => {
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
            <Tooltip title={copied ? "Copied!" : "Copy"} arrow={true} placement={placement}>
                <Box component="span" sx={{ cursor: 'pointer' }}>
                    { children }
                </Box>
            </Tooltip>
        </CopyToClipboard>
    )
}