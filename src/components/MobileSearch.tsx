
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import { SearchBox } from "./Search";

interface MobileSearchProps {
    setMobileSearchOpen: Function;
    mobileSearchOpen: boolean;
}

export const MobileSearch: React.FC<MobileSearchProps> = ({
    setMobileSearchOpen, 
    mobileSearchOpen
}) => (
    <Box
        sx={{
            display: {
                xs: 'block',
                md: 'none'
            }
        }}>
        <ClickAwayListener
            onClickAway={() =>
                setMobileSearchOpen(false)
            }
            touchEvent={false}>
            <Fade in={mobileSearchOpen} timeout={300} >
                <Container
                    sx={{
                        color: 'black',
                        background: 'white',
                        paddingX: 2,
                        paddingY: 2,
                    }}>
                    <SearchBox 
                        setMobileSearchOpen={setMobileSearchOpen} 
                    />
                </Container>
            </Fade>
        </ClickAwayListener>
    </Box>
)