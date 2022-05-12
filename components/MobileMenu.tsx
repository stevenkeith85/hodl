import { useTheme } from '@mui/material/styles';
import { Box, ClickAwayListener, Container, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { MainMenuPage } from './menu/MainMenuPage';
import { WalletMenuPage } from './menu/WalletMenuPage';


export const MobileMenu = ({ pages, mobileMenuOpen, setMobileMenuOpen, page = 0, showBack = true, nicknameModalOpen, setNicknameModalOpen, profilePictureModalOpen, setProfilePictureModalOpen }) => {
    const router = useRouter();

    const [menuPage, setMenuPage] = useState(page);

    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const closeMenu = (e) => {
        setMobileMenuOpen(false);
    }

    if (!mobileMenuOpen) {
        return null;
    }
    return (
        <>
                <Box
                    sx={{
                        position: 'absolute',
                        display: mobileMenuOpen ? 'block': 'none',
                        animation: xs ? 
                            mobileMenuOpen ? `slidein 0.25s forwards` : `slideout 0.25s forwards` :  
                            mobileMenuOpen ? `fadein 0.25s forwards`: `fadeout 0.25s forwards`,
                        zIndex: 100,
                        background: 'white',
                        color: 'black',
                        top: 60,
                        right: 0,
                        minWidth: '300px',
                        height: { xs: 'calc(100vh - 60px)', sm: '300px'},
                        width: { xs: 'calc(100vw)', sm: 'auto'},
                        overflow: 'auto',
                        border: `1px solid #f0f0f0`,
                        margin: 0,
                        marginLeft: '-16px',
                        padding: 2,
                        borderRadius: 1
                    }}
                >
                    <ClickAwayListener onClickAway={closeMenu} touchEvent={false}>
                        <Box sx={{ height: `100%`}}>
                        {menuPage === 0 && <MainMenuPage
                            closeMenu={closeMenu}
                            pages={pages}
                            router={router}
                            setMenuPage={setMenuPage}
                        />}
                        {menuPage === 1 && <WalletMenuPage
                            setNicknameModalOpen={setNicknameModalOpen}
                            setProfilePictureModalOpen={setProfilePictureModalOpen}
                            closeMenu={closeMenu}
                            setMenuPage={setMenuPage}
                            showBack={showBack}
                        />}
                        </Box>
                        </ClickAwayListener>
                    </Box>
        </>
    )
}