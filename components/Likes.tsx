import { Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useTokenLikes } from "../hooks/useTokenLikes";

export const Likes = ({token, sx={}}) => {
    const [tokenLikesCount, userLikesThisToken, toggleLike] = useTokenLikes(token);

    return (
        <Stack spacing={1} direction="row" sx={{ color: "white", alignItems: "center", ...sx }}>
                {!userLikesThisToken ? <FavoriteBorderIcon onClick={ toggleLike } /> :  <FavoriteIcon onClick={ toggleLike }/> }
                <Typography sx={{ fontSize: 14, fontWeight: 900 }}>{ tokenLikesCount }</Typography>
        </Stack>
    )
}