import { Box, Grid, Typography } from "@mui/material"
import { LoginLogoutButton } from "../menu/LoginLogoutButton"

export const AboutPagePitch = ({ }) => {
    return (
        <Grid
            container
            sx={{
            }}
        >
            <Grid
                item
                xs={12}
                sx={{
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    gap={0}
                    height="100%"
                    sx={{
                        paddingY: `70px`,
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: {
                                xs: '30px',
                                sm:'40px',
                            },
                            fontWeight: 600,
                            color: theme => theme.palette.primary.main
                        }}>
                        About

                    </Box>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '25px',
                            color: '#999'
                        }}>
                        Hodl My Moon
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    )
}