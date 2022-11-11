import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function PrivateHomePageSwitchLoading({ }) {
    return (
        <Box
            sx={{
                display: {xs: 'flex', md: 'none'},
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
                <Box sx={{ padding: 1.5, position: 'relative' }}>
                    <Box sx={{ padding: '9px', position: 'absolute', left: 0, top: 0 }}>
                        <Skeleton variant="circular" animation="wave" width="20px" height="20px" />
                    </Box>
                    <Skeleton variant="rounded" animation="wave" width="34px" height="14px" />
                </Box>
            </Box>
        </Box>
    )
}