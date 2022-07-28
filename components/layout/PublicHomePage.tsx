import { Box, Grid } from "@mui/material"
import { HomePagePitch } from "./HomePagePitch"
import { TopUsers } from "../rankings/TopUsers"
import { TopTokens } from "../rankings/TopTokens"
import { NewTokens } from "../rankings/NewTokens"
import { NewUsers } from "../rankings/NewUsers"

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
                spacing={4}
                container
                paddingBottom={4}
            >
                <Grid item xs={12} sm={6} md={3}>
                    <TopUsers />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TopTokens showLikes={false} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <NewUsers />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <NewTokens showLikes={false} />
                </Grid>
            </Grid>
        </Box >
    )
}