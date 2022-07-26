import { Box, Grid } from "@mui/material"
import { HomePagePitch } from "./HomePagePitch"
import { TopAccounts } from "../rankings/TopAccounts"
import { TopTokens } from "../rankings/TopTokens"

export const PublicHomePage = ({ }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
        >
            <Box display="flex">
                <HomePagePitch />
            </Box>
            <Grid
                // spacing={1}
                container
                paddingBottom={4}
            >
                <Grid item xs={12} sm={6} md={3}>
                    <TopAccounts />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TopTokens showLikes={false} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TopAccounts />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TopTokens showLikes={false} />
                </Grid>
            </Grid>
        </Box >
    )
}