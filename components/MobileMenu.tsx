import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { MainMenuPage } from './menu/MainMenuPage';
import { WalletMenuPage } from './menu/WalletMenuPage';

// TODO: Rename file
export const HoverMenu = ({ pages, hoverMenuOpen, setHoverMenuOpen, page = null }) => {
    const router = useRouter();

    const [menuPage, setMenuPage] = useState(page);

    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    if (!hoverMenuOpen) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    position: { xs: 'fixed', sm: 'absolute' },
                    display: hoverMenuOpen ? 'block' : 'none',
                    animation: xs ?
                        hoverMenuOpen ? `slidein 0.25s forwards` : `slideout 0.25s forwards` :
                        hoverMenuOpen ? `fadein 0.25s forwards` : `fadeout 0.25s forwards`,
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
                    boxShadow: '0 0 2px 1px #eee;'
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
        </>
    )
}