import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

import { WalletMenuPage } from './WalletMenuPage';

interface HoverMenuProps {
    hoverMenuOpen: boolean;
    setHoverMenuOpen: Function;
}

export const HoverMenu: React.FC<HoverMenuProps> = ({ 
    hoverMenuOpen, 
    setHoverMenuOpen 
}) => {
    return (
        <>
            <Fade in={hoverMenuOpen} timeout={300} >
                <Box
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
                        borderRadius: {xs: 0, sm: 1},
                        boxShadow: '0 0 2px 1px #eee'
                    }}
                >
                    <Box sx={{ height: `100%` }}>
                        <WalletMenuPage
                            hoverMenuOpen={hoverMenuOpen}
                            setHoverMenuOpen={setHoverMenuOpen}
                        />
                    </Box>
                </Box>
            </Fade>
        </>
    )
}