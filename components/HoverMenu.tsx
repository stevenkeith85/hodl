import { useTheme } from '@mui/material/styles';
import { Box, Fade, Slide, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MainMenuPage } from './menu/MainMenuPage';
import { WalletMenuPage } from './menu/WalletMenuPage';

export const HoverMenu = ({ pages, hoverMenuOpen, setHoverMenuOpen, page = null }) => {
    const [menuPage, setMenuPage] = useState(page);
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const menu = <Box
        sx={{
            position: { xs: 'fixed', sm: 'absolute' },
            zIndex: 100,
            background: 'white',
            color: 'black',
            top: 56,
            right: 0,
            minWidth: '300px',
            height: { xs: 'calc(100vh - 56px)', sm: 'auto' },
            width: { xs: '100%', sm: 'auto' },
            overflow: 'auto',
            border: `1px solid #ddd`,
            margin: 0,
            padding: 2,
            borderRadius: xs ? 0 : 1,
            boxShadow: '0 0 2px 1px #eee'
        }}
    >
        <Box sx={{ height: `100%` }}>
            {menuPage === 0 && <MainMenuPage
                hoverMenuOpen={hoverMenuOpen}
                setHoverMenuOpen={setHoverMenuOpen}
                pages={pages}
                setMenuPage={setMenuPage}
            />}
            {menuPage === 1 && <WalletMenuPage
                hoverMenuOpen={hoverMenuOpen}
                setHoverMenuOpen={setHoverMenuOpen}
                setMenuPage={setMenuPage}
                menuPage={menuPage}
            />}
        </Box>
    </Box>
    return (
        <>
            <Fade in={hoverMenuOpen} timeout={300} >{menu}</Fade>
        </>
    )
}