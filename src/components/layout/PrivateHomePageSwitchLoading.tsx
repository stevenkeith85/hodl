import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function PrivateHomePageSwitchLoading({ }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'right',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    marginTop: 1,
                    marginX: {
                        xs: 0,
                        sm: 4
                    }
                }}
            >
                <Skeleton variant="rounded" animation="wave" width="35px" height="17px" sx={{ marginY: 2 }} />
            </Box>
        </Box>
    )
}