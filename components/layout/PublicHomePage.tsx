import { Box } from "@mui/material"
import { indigo, pink, grey } from "@mui/material/colors"
import { HomePagePitch } from "./HomePagePitch"
import { FollowPreview } from "./FollowPreview"
import { CreatePreview } from "./CreatePreview"
import { TradePreview } from "./TradePreview"
import { ProfilePreview } from "./ProfilePreview"

export const PublicHomePage = ({ }) => {
    return (
        <Box
            display="flex"
            minHeight={'calc(100vh - 195px)'}
            flexDirection="column"
        >
            <Box
                display="flex"
                sx={{
                    flexGrow: 2,
                }}
            >
                <HomePagePitch />
            </Box>
            <Box
                display="flex"
                sx={{
                    background: pink[100],
                    color: 'white',
                    padding: 4,
                    flexGrow: 2
                }}
            >
                <CreatePreview />
            </Box>
            <Box
                display="flex"
                sx={{
                    background: grey[100],
                    padding: 4,
                    flexGrow: 2,
                }}
            >
                <FollowPreview />
            </Box>
            <Box
                display="flex"
                sx={{
                    background: indigo[100],
                    padding: 4,
                    flexGrow: 2,
                }}
            >
                <TradePreview />
            </Box>
            <Box
                display="flex"
                sx={{
                    background: grey[100],
                    padding: 4,
                    flexGrow: 2,
                }}
            >
                <ProfilePreview />
            </Box>
        </Box >
    )
}