import Box from '@mui/material/Box';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';


export const LikesLoading = ({
    color = "secondary",
    size = 22,
    fontSize = 14,
    flexDirection = "row",
    sx = {}
}) => {

    return (
        <>
            <Box
                gap={0.5}
                sx={{
                    display: 'flex',
                    flexDirection,
                    color,
                    alignItems: "center",
                    cursor: 'pointer',
                    position: 'relative',
                    ...sx
                }}
                onClick={async () => {
                }}
            >

                <FavoriteBorderIcon
                    sx={{
                        color: "#ddd",
                        fontSize: size
                    }}
                />
                <Skeleton variant="text">
                    <Typography sx={{ fontSize, color }}>0</Typography>
                </Skeleton>
            </Box>
        </>
    )
}
