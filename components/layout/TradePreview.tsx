import { Box, Grid, Typography } from "@mui/material"

export const TradePreview = ({ }) => {
    return (
        <Grid
            container
            // spacing={4}
            sx={{ color: 'white'}}
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
                    alignItems={"center"}
                    gap={4}
                    height="100%"
                >
                    <Box sx={{ img: {border: '2px solid black', width: '500px', maxWidth: '100%'}}}>
                        <img src={'/desktop-export.png'} width="500px" />
                    </Box>
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
                    sx={{
                        height: '100%',
                        padding: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Box display="flex" padding={4} gap={4} flexDirection="column">
                    <Box
                        component="span"
                        sx={{
                            fontSize: '35px',
                            fontWeight: 600,
                        }}>
                        Trade
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '25px'
                        }}>
                        digital assets
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '20px',
                            flexGrow: 1,
                        }}>
                        to gain any privileges they bestow
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '20px',
                        }}>
                    </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}