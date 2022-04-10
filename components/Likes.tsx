import { Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLike } from "../hooks/useLike";
import { memo } from "react";

export const Likes = ({tokenId, sx={}}) => {
    const [tokenLikesCount, userLikesThisToken, toggleLike] = useLike(tokenId);

    return (
        <Stack spacing={1} direction="row" sx={{ color: "white", alignItems: "center", ...sx }}>
                {!userLikesThisToken ? <FavoriteBorderIcon onClick={ toggleLike } /> :  <FavoriteIcon onClick={ toggleLike }/> }
                <Typography sx={{ fontSize: 14, fontWeight: 900 }}>{ tokenLikesCount }</Typography>
        </Stack>
    )
}

export const LikesMemo = memo(Likes);