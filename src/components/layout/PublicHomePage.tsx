import { Box } from "@mui/material"
import { HomePagePitch } from "./HomePagePitch"
import { TopUsers } from "../rankings/TopUsers"
import { TopTokens } from "../rankings/TopTokens"
import { NewTokens } from "../rankings/NewTokens"
import { NewUsers } from "../rankings/NewUsers"

const PublicHomePage = ({ }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <Box display="flex">
                <HomePagePitch />
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: `1fr`,
                        sm: `1fr 1fr`,
                    },
                    marginY: {
                        xs: 2,
                        sm: 4
                    },
                    marginX: {
                        xs: 0,
                        sm: 4
                    },
                    marginTop: {
                        xs: 0,
                        sm: 4
                    },
                    gap: 4,
                }}
            >
                <TopUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <TopTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <NewUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <NewTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
            </Box>
        </Box >
    )
}

export default PublicHomePage