import React from "react";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PushPinIcon from '@mui/icons-material/PushPin';


export default function HodlCommentPopUpMenu({ onDelete, onPin }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                className="moreMenu"
                onClick={handleClick}
                size="small"
                sx={{
                    padding: 0,
                }}
            >
                <MoreVertIcon
                    sx={{
                        cursor: 'pointer',
                        color: theme => theme.palette.text.secondary,
                        '&:hover': {
                            color: theme => theme.palette.text.primary,
                        },
                        fontSize: 12
                    }}
                />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                <MenuList dense>
                    <MenuItem
                        onClick={onDelete}>
                        <ListItemIcon>
                            <DeleteOutlineSharpIcon sx={{ fontSize: '14px' }} />
                        </ListItemIcon>
                        <ListItemText>delete</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={onPin}>
                        <ListItemIcon>
                            <PushPinIcon sx={{ fontSize: '14px' }} />
                        </ListItemIcon>
                        <ListItemText>pin</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}