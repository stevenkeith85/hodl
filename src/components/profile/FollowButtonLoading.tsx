import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

export const FollowButtonLoading = () => (
    <Box
        sx={{
            marginY: 0.75,
        }}
    >
        <Skeleton sx={{
            paddingX: 0.75,
            paddingY: 0.25
        }}
            variant="rounded" animation="wave"><Typography>Follow</Typography></Skeleton>
    </Box>
)