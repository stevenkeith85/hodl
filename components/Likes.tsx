import { Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLike } from "../hooks/useLike";

export const Likes = ({ tokenId, sx = {} }) => {
    const [tokenLikesCount, userLikesThisToken, toggleLike] = useLike(tokenId);

    return (
        <>
            <Stack
                spacing={0.5}
                direction="row"
                sx={{
                    color: "white",
                    alignItems: "center",
                    ...sx
                }}>
                {
                    !userLikesThisToken ?
                        <FavoriteBorderIcon onClick={toggleLike} /> :
                        <FavoriteIcon onClick={toggleLike} />
                }
                <Typography>{tokenLikesCount}</Typography>
            </Stack>
        </>
    )
}
