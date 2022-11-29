import React from 'react';

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

import MenuList from '@mui/material/MenuList';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';

export const HodlShareMenu = ({ nft, anchorEl, open, handleClose }) => {
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
                <Link 
                    sx={{ textDecoration: 'none' }} 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this #nft on hodlmymoon.com (@hodlmymoon)')}&url=${encodeURIComponent('https://www.hodlmymoon.com/nft/' + nft.id)}`}>
                    <MenuItem>
                        <ListItemIcon>
                            <TwitterIcon />
                        </ListItemIcon>
                        <ListItemText>Twitter</ListItemText>
                    </MenuItem>
                </Link>
                <Link 
                    sx={{ textDecoration: 'none' }} 
                    href={`https://www.facebook.com/sharer/sharer.php?display=page&u=${encodeURIComponent('http://www.hodlmymoon.com/nft/' + nft.id)}`}>
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
