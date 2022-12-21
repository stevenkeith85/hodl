import Box from '@mui/material/Box';

import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

export const CommentsLoading = ({
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
                <CommentOutlinedIcon sx={{ fontSize: size, color: '#ddd' }} />
                <Skeleton variant="text">
                    <Typography sx={{ fontSize, color }}>0</Typography>
                </Skeleton>
            </Box>
        </>
    )
}
