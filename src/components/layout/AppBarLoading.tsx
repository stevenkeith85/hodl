import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";

export const AppBarLoading = ({ }) => (
    <Container
        maxWidth="xl"
        sx={{
            width: '100%',
            position: 'relative'
        }}>
        <Box
            sx={{
                padding: 1,
                display: 'flex',
                justifyContent: 'space-between',
                height: '64px'
            }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5
            }}>
                <Skeleton variant="circular" width={30} height={30} animation="wave" />
                <Skeleton variant="text" width={55} height={30} animation="wave" />
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4
            }}>
                <Skeleton variant="text" width={160} height={60} animation="wave" />
                <Skeleton variant="circular" width={30} height={30} animation="wave" />
            </Box>
        </Box>
    </Container>
)