import { Box } from "@mui/material"
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
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs:`1fr`,
                        sm:`1fr 1fr`,
                        // lg: `1fr 1fr 1fr 1fr`
                    },
                    gap: 8,
                    marginBottom: 10
                }}>
                    <TopUsers followButton={false} titleSize={18} height={380} size={54} fontSize={14} titleMargin={3}/>
                    <TopTokens showLikes={false} titleSize={18} height={380} size={54} fontSize={14} titleMargin={3} />
                    <NewUsers followButton={false} titleSize={18} height={380} size={54} fontSize={14} titleMargin={3} />
                    <NewTokens showLikes={false} titleSize={18} height={380} size={54} fontSize={14} titleMargin={3} />
            </Box>
        </Box >
    )
}