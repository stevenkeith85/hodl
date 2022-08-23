import { Box, Grid } from "@mui/material"
import { HomePagePitch } from "./HomePagePitch"
import { TopUsers } from "../rankings/TopUsers"
import { TopTokens } from "../rankings/TopTokens"
import { NewTokens } from "../rankings/NewTokens"
import { NewUsers } from "../rankings/NewUsers"
import { HodlBorderedBox } from "../HodlBorderedBox"

export const PublicHomePage = ({ }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
        >
            <Box display="flex">
                <HomePagePitch />
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs:`1fr`,
                        sm:`1fr 1fr`,
                        lg: `1fr 1fr 1fr 1fr`
                    },
                    gap: 4,
                    marginBottom: '50px'
                }}>
                    <TopUsers followButton={false} />
                    <TopTokens showLikes={false} />
                    <NewUsers followButton={false} />
                    <NewTokens showLikes={false} />
            </Box>
        </Box >
    )
}