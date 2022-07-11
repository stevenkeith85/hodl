import { Box, Grid, Paper, Typography } from "@mui/material"
import { indigo, blueGrey, lightGreen, pink, grey } from "@mui/material/colors"
import { ConnectButton } from "../ConnectButton"
import { HomePagePitch } from "./HomePagePitch"
import { FeedPreview } from "./FeedPreview"
import { CreatePreview } from "./CreatePreview"
import { TradePreview } from "./TradePreview"

export const PublicHomePage = ({ }) => {
    return (
        <Box
            sx={{
                // background: theme => theme.palette.secondary.light,
            }}
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
                    background: pink[200],
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
                <FeedPreview />
            </Box>
            <Box
                display="flex"
                sx={{
                    background: indigo[200],
                    padding: 4,
                    flexGrow: 2,
                }}
            >
                <TradePreview />
            </Box>
        </Box >
    )
}