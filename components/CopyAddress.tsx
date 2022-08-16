import { Box, Tooltip, Typography } from '@mui/material'
import { getShortAddress } from '../lib/utils';


export const CopyAddress = ({owner}) => (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', cursor: 'pointer' }}>
        <img src="/matic.svg" width={14} height={14} alt="matic symbol" />
        <Tooltip title={"Copy"} arrow placement="bottom">
            <Typography
                onClick={() => {
                    window.prompt("Copy to clipboard: Ctrl+C, Enter", owner.address);
                }}
                sx={{
                    color: theme => theme.palette.text.secondary,
                    fontSize: '14px',
                    lineHeight: 0
                }}>
                {getShortAddress(owner.address)}
            </Typography>
        </Tooltip>
    </Box>
)