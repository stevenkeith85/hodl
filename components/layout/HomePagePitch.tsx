import { Box, Grid, Typography } from "@mui/material"
import { ConnectButton } from "../ConnectButton"

export const HomePagePitch = ({ }) => {
    return (
        <Grid
            container
            // spacing={4}
            padding={4}
            maxWidth="1200px"
            minHeight="400px"
            margin="0 auto"
        >
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    gap={4}
                    height="100%"
                    sx={{
                        padding: 4,
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            fontSize: '40px',
                            fontWeight: 600,
                            color: theme => theme.palette.primary.main
                        }}>
                        Hodl My Moon
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '25px'
                        }}>
                        is an NFT based social platform
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '20px'
                        }}>
                        Create, Hodl, or Trade your NFTs
                    </Typography>
                </Box>
            </Grid>
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={4}
                    height="100%"
                    sx={{
                        padding: 4,
                    }}
                >
                    <Box>
                        <ConnectButton
                            fontSize='20px'
                            sx={{ paddingY: 1.5, paddingX: 4 }}
                        />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}