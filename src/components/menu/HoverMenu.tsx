import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import theme from '../../theme';

import { WalletMenuPage } from './WalletMenuPage';

interface HoverMenuProps {
    hoverMenuOpen: boolean;
    setHoverMenuOpen: Function;
}

// TODO: Combine with WalletMenuPage
export const HoverMenu: React.FC<HoverMenuProps> = ({
    hoverMenuOpen,
    setHoverMenuOpen
}) => {
    return (
        <>
            <Fade in={hoverMenuOpen} timeout={300} >
                <Box
                    sx={{
                        position: { 
                            xs: 'fixed', 
                            sm: 'absolute' 
                        },
                        zIndex: 100,
                        background: 'white',
                        color: theme.palette.text.primary,
                        top: 64,
                        right: 0,
                        minWidth: '300px',
                        height: { 
                            xs: 'calc(100vh - 64px)', 
                            sm: 'auto' 
                        },
                        width: { 
                            xs: '100%', 
                            sm: 'auto' 
                        },
                        overflow: 'auto',
                        boxSizing: 'border-box',
                        border: `1px solid #ddd`,
                        margin: 0,
                        padding: 2,
                        borderRadius: { 
                            xs: 0, 
                            sm: 1 
                        },
                    }}
                >
                    <WalletMenuPage
                        hoverMenuOpen={hoverMenuOpen}
                        setHoverMenuOpen={setHoverMenuOpen}
                    />
                </Box>
            </Fade>
        </>
    )
}