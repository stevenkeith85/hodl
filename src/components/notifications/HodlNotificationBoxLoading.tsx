import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { UserAvatarAndHandleBodyLoading } from "../avatar/UserAvatarAndHandleBodyLoading";

export const HodlNotificationBoxLoading = () => (
    <Box sx={{
        background: "white",
        padding: 1,
        marginX: 0.5,
        marginY: 0.75,
    }}>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'start',
                gap: 1,
                justifyContent: 'space-between'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: 2,
                    width: 'calc(100% - 80px)'
                }}
            >
                <UserAvatarAndHandleBodyLoading
                    size={44}
                    handle={false}
                />
                <Box>
                    <Skeleton variant="text" width={80} animation="wave"></Skeleton>
                    <Skeleton variant="text" width={160} animation="wave"></Skeleton>
                </Box>
            </Box>
            <Box
                sx={{
                    width: '80px',
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'end'
                }}
            >
                {
                    <Skeleton variant="rectangular" width={44} height={44} animation="wave"></Skeleton>
                }
            </Box>
        </Box>
    </Box>
)