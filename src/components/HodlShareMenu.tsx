import React from 'react';

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";

import MenuList from '@mui/material/MenuList';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import { CopyText } from './CopyText';

export const HodlShareMenu = ({ 
    anchorEl, 
    open, 
    handleClose,
    relativeUrl
}) => {
    return (<>
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={open}
            onClose={handleClose}
        >
            <MenuList sx={{ padding: 0 }}>
                <MenuItem>
                    <ListItemIcon>
                        <ContentCopyIcon />
                    </ListItemIcon>
                    <CopyText text={`https://www.hodlmymoon.com${relativeUrl}`}>
                        <ListItemText sx={{color:"primary.main"}}>Copy Link</ListItemText>
                    </CopyText>
                </MenuItem>
                <Link
                    sx={{ textDecoration: 'none' }}
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://www.hodlmymoon.com' + relativeUrl)}`}>
                    <MenuItem>
                        <ListItemIcon>
                            <TwitterIcon />
                        </ListItemIcon>
                        <ListItemText>Twitter</ListItemText>
                    </MenuItem>
                </Link>
                <Link
                    sx={{ textDecoration: 'none' }}
                    href={`https://www.facebook.com/sharer/sharer.php?display=page&u=${encodeURIComponent('https://www.hodlmymoon.com' + relativeUrl)}`}>
                    <MenuItem>
                        <ListItemIcon>
                            <FacebookIcon />
                        </ListItemIcon>
                        <ListItemText>Facebook</ListItemText>
                    </MenuItem>
                </Link>
                <Link
                    sx={{ textDecoration: 'none' }}
                    href={`https://telegram.me/share/?url=${encodeURIComponent('https://www.hodlmymoon.com' + relativeUrl)}`}>
                    <MenuItem>
                        <ListItemIcon>
                            <TelegramIcon />
                        </ListItemIcon>
                        <ListItemText>Telegram</ListItemText>
                    </MenuItem>
                </Link>
            </MenuList>
        </Menu>
    </>)
}
