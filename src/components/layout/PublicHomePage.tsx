import { HomePagePitch } from "./HomePagePitch"
import { TopUsers } from "../rankings/TopUsers"
import { TopTokens } from "../rankings/TopTokens"
import { NewTokens } from "../rankings/NewTokens"
import { NewUsers } from "../rankings/NewUsers"

import Box from "@mui/material/Box"

const PublicHomePage = ({ }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{
                display: 'flex',
            }}>
                <HomePagePitch />
            </div>
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
                    gap: 6,
                }}
            >
                <TopUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <TopTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <NewUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <NewTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
            </Box>
        </div>
    )
}

export default PublicHomePage