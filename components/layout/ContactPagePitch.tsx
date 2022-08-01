import { Box, Grid, Typography } from "@mui/material"
import { LoginLogoutButton } from "../menu/LoginLogoutButton"

export const ContactPagePitch = ({ }) => {
    return (
        <Grid
            container
            sx={{
                padding: {
                    'xs': 6,
                    'sm': 8,
                    'xl': 12,
                }
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
                        paddingY: 4,
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
                        Contact

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