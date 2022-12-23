import React from 'react';

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import MenuList from '@mui/material/MenuList';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';

import dynamic from 'next/dynamic';
import Typography from '@mui/material/Typography';

const CopyText = dynamic(
    () => import('./CopyText').then(mod => mod.CopyText),
    {
        ssr: true,
        loading: () => null
    }
);

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
                <MenuItem sx={{ padding: 1, paddingX: 2 }}>

                    <ListItemIcon>
                        <CopyText text={`https://www.hodlmymoon.com${relativeUrl}`}>
                            <ContentCopyIcon sx={{ fontSize: 22, color: "primary.main" }} />
                        </CopyText>
                    </ListItemIcon>


                    <ListItemText >
                        <CopyText text={`https://www.hodlmymoon.com${relativeUrl}`}>
                            <Typography sx={{ color: "text.primary", fontSize: 12 }}>Copy link</Typography>
                        </CopyText>
                    </ListItemText>

                </MenuItem>
                <Link
                    sx={{ textDecoration: 'none' }}
                    target="_blank"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out this #nft on @hodlmymoon")}&url=${encodeURIComponent('https://www.hodlmymoon.com' + relativeUrl)}`}>
                    <MenuItem sx={{ padding: 1, paddingX: 2 }}>
                        <ListItemIcon>
                            <TwitterIcon sx={{ fontSize: 22, color: "#1DA1F2" }} />
                        </ListItemIcon>
                        <ListItemText><Typography sx={{ color: "text.primary", fontSize: 12 }}>Share on Twitter</Typography></ListItemText>
                    </MenuItem>
                </Link>
                <Link
                    sx={{ textDecoration: 'none' }}
                    target="_blank"
                    href={`https://www.facebook.com/sharer/sharer.php?display=page&u=${encodeURIComponent('https://www.hodlmymoon.com' + relativeUrl)}`}>
                    <MenuItem sx={{ padding: 1, paddingX: 2 }}>
                        <ListItemIcon>
                            <FacebookIcon sx={{ fontSize: 22, color: "#4267B2" }} />
                        </ListItemIcon>
                        <ListItemText><Typography sx={{ color: "text.primary", fontSize: 12 }}>Share on Facebook</Typography></ListItemText>
                    </MenuItem>
                </Link>
                <Link
                    sx={{ textDecoration: 'none' }}
                    href={`https://telegram.me/share/?url=${encodeURIComponent('https://www.hodlmymoon.com' + relativeUrl)}`}>
                    <MenuItem sx={{ padding: 1, paddingX: 2 }}>
                        <ListItemIcon>
                            <TelegramIcon sx={{ fontSize: 22, color: "#0088CC" }} />
                        </ListItemIcon>
                        <ListItemText><Typography sx={{ color: "text.primary", fontSize: 12 }}>Share on Telegram</Typography></ListItemText>
                    </MenuItem>
                </Link>
                <Link
                    sx={{ textDecoration: 'none' }}
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('https://www.hodlmymoon.com' + relativeUrl)}`}>
                    <MenuItem sx={{ padding: 1, paddingX: 2 }}>
                        <ListItemIcon>
                            <WhatsAppIcon sx={{ fontSize: 22, color: "#25D366" }} />
                        </ListItemIcon>
                        <ListItemText><Typography sx={{ color: "text.primary", fontSize: 12 }}>Share on WhatsApp</Typography></ListItemText>
                    </MenuItem>
                </Link>
            </MenuList>
        </Menu>
    </>)
}
