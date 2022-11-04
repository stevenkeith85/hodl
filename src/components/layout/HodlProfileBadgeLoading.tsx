import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { HodlBorderedBox } from "../HodlBorderedBox";


export default function HodlProfileBadgeLoading() {
    return (
        <HodlBorderedBox
            sx={{
                width: `100%`,
            }}
        >
            <Box
                display="flex"
                flexDirection={"column"}
                justifyContent="space-evenly"
                alignItems={"start"}
                sx={{
                    gap: 2,
                }}
            >
                <Box
                    display="flex"
                    gap={2}
                    alignItems={"center"}
                >
                    <Skeleton variant="circular" animation="wave" width={70} height={70} />
                    <Skeleton variant="text" animation="wave" width={70} height={18} />
                </Box>
                <Box
                    display="grid"
                    gridTemplateColumns="1fr 1fr 1fr 1fr"
                    sx={{
                        paddingX: 1,
                        width: '100%',
                        gap: 1
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                        <Skeleton variant="text" animation="wave"><Typography>Hodling</Typography></Skeleton>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                        <Skeleton variant="text" animation="wave"><Typography>Listed</Typography></Skeleton>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                        <Skeleton variant="text" animation="wave"><Typography>Following</Typography></Skeleton>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                        <Skeleton variant="text" animation="wave"><Typography>Followers</Typography></Skeleton>
                    </Box>
                </Box>
            </Box>
        </HodlBorderedBox>
    )
}
