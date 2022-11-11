import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export const HodlNotificationBoxLoading = ({ }) => (
    <Box
        sx={{
            marginX: 0.5,
            marginY: 0.75
        }}>
        <Skeleton
            variant="rectangular"
            animation="wave"
            width={'100%'}
            height={50}
        />
    </Box>)