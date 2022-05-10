import { useTheme } from '@mui/material/styles';
import { Box, ClickAwayListener, Container, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NicknameModal } from "./modals/NicknameModal";
import { ProfilePictureModal } from "./ProfilePictureModal";
import { MainMenuPage } from './menu/MainMenuPage';
import { WalletMenuPage } from './menu/WalletMenuPage';


export const MobileMenu = ({ pages, mobileMenuOpen, setMobileMenuOpen, page = 0, showBack = true, nicknameModalOpen, setNicknameModalOpen, profilePictureModalOpen, setProfilePictureModalOpen }) => {
    const router = useRouter();

    const [menuPage, setMenuPage] = useState(page);

    // const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    // const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);

    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const closeMenu = () => {
        setMobileMenuOpen(false)
    }

    if (!mobileMenuOpen) {
        return null;
    }
    return (
        <>
            {/* <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>
            <ProfilePictureModal profilePictureModalOpen={profilePictureModalOpen} setProfilePictureModalOpen={setProfilePictureModalOpen}></ProfilePictureModal> */}
            <ClickAwayListener onClickAway={closeMenu}>
                <Box
                    sx={{
                        position: 'fixed',
                        left: 0,
                        background: { xs: 'white', sm: 'none' },
                        opacity: 1,
                        color: theme => theme.palette.primary.dark,
                        height: { xs: `calc(100% - 56px)`, sm: '100%' },
                        width: { xs: '100%' },
                        top: '60px',
                        animation: xs ? `slidein 0.25s forwards` : `fadein 0.25s forwards`,
                        zIndex: 100,
                        padding: 0
                    }}
                >
                    <Container maxWidth="xl"
                        sx={{
                            height: '100%'
                        }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: {
                                    xs: 0,
                                    sm: 'calc(100% - 250px)'
                                },
                                padding: 0,
                                background: 'white',
                                border: { xs: 'none', sm: `1px solid #f0f0f0` },
                                borderTop: 'none',
                                height: {
                                    xs: '100%',
                                    sm: `300px`
                                },
                                minHeight: '200px',
                            }}>

                            {menuPage === 0 && <MainMenuPage
                                // closeMenu={closeMenu}
                                pages={pages}
                                router={router}
                                setMenuPage={setMenuPage}
                            />}
                            {menuPage === 1 && <WalletMenuPage
                                setNicknameModalOpen={setNicknameModalOpen}
                                setProfilePictureModalOpen={setProfilePictureModalOpen}
                                // closeMenu={closeMenu}
                                setMenuPage={setMenuPage}
                                showBack={showBack}
                            />}
                        </Box>
                    </Container>
                </Box>
            </ClickAwayListener>
        </>
    )
}