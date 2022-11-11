import Box from "@mui/material/Box";
import { HodlFeedItemLoading } from "../feed/HodlFeedItemLoading";

export default function HodlFeedLoading() {
    return (
        <Box
            id="hodlfeed"
            sx={{
                gap: {
                    xs: 2,
                    sm: 4
                }
            }}
            display="flex"
            flexDirection="column"
        >
            <HodlFeedItemLoading />
            <HodlFeedItemLoading />
        </Box>
    )
}
