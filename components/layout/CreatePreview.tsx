import { Box, Grid, Typography } from "@mui/material"

export const CreatePreview = ({ }) => {
    return (
        <Grid
            container
            // spacing={4}
            maxWidth="1200px"
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
                        <img src={'/desktop-create.png'} />
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
                    <Box display="flex" gap={4} padding={4} flexDirection="column">
                    <Box
                        component="span"
                        sx={{
                            fontSize: '35px',
                            fontWeight: 600,
                        }}>
                        Create
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '25px'
                        }}>
                        decentralized digital content
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '20px',
                            flexGrow: 1,
                        }}>
                        minted on the blockchain
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