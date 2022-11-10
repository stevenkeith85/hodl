import React from 'react';

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import { ShareIcon } from './icons/ShareIcon';
import { grey } from "@mui/material/colors";

export const HodlShareMenu = ({ nft, anchorEl, open, handleClose }) => {
    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const open = Boolean(anchorEl);
    // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    return (<>
        {/* <IconButton
            className="shareMenu"
            onClick={handleClick}
            size="small"
            sx={{
                padding: 0,
                lineHeight: 0,
            }}
        >
            <ShareIcon size={20} fill={grey[600]} />
        </IconButton> */}
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
                <Link sx={{ textDecoration: 'none' }} href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('http://hodlmymoon.com/nft/' + nft.id)}`}>
                    <MenuItem>
                        <ListItemIcon>
                            <TwitterIcon />
                        </ListItemIcon>
                        <ListItemText>Twitter</ListItemText>
                    </MenuItem>
                </Link>
                <Link sx={{ textDecoration: 'none' }} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('http://hodlmymoon.com/nft/' + nft.id)}`}>
                    <MenuItem>
                        <ListItemIcon>
                            <FacebookIcon />
                        </ListItemIcon>
                        <ListItemText>Facebook</ListItemText>
                    </MenuItem>
                </Link>
            </MenuList>
        </Menu>
    </>)
}
