import { Box, ClickAwayListener, Fade, Container } from "@mui/material";
import { SearchBox } from "./Search";

export const MobileSearch = ({setMobileSearchOpen, mobileSearchOpen}) => (
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