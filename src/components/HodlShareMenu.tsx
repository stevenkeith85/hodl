import {
    IconButton,
    Link,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList
} from "@mui/material";

import React from 'react';
import { Facebook, Send, Twitter } from "@mui/icons-material";

export const HodlShareMenu = ({ nft }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<>
        <IconButton
            className="shareMenu"
            onClick={handleClick}
            size="small"
            sx={{
                padding: 0,
                // visibility: 'hidden'
            }}
        >
            <Send sx={{
                fontSize: 20,
                lineHeight: 0,
                color: theme => theme.palette.text.secondary
            }}
            />
        </IconButton>

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

            <MenuList
                sx={{
                    padding: 0
                }}
            >
                <Link sx={{ textDecoration: 'none' }}
                    // href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('http://hodlmymoon.com/nft/' + nft.id)}`}
                    href="#"
                >
                    <MenuItem>
                        <ListItemIcon>
                            <Twitter />
                        </ListItemIcon>
                        <ListItemText>Twitter</ListItemText>
                    </MenuItem>
                </Link>
                <Link sx={{ textDecoration: 'none' }}
                    // href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('http://hodlmymoon.com/nft/' + nft.id)}`}
                    href="#"
                >
                    <MenuItem>
                        <ListItemIcon>
                            <Facebook />
                        </ListItemIcon>
                        <ListItemText>Facebook</ListItemText>
                    </MenuItem>
                </Link>
            </MenuList>
        </Menu>
    </>)
}