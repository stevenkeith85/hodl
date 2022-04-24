import { Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLike } from "../hooks/useLike";
import { useSnackbar } from 'notistack';
import { useEffect } from "react";

export const Likes = ({ tokenId, sx = {} }) => {
    const [tokenLikesCount, userLikesThisToken, toggleLike, error, setError] = useLike(tokenId);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (error !== '') {
            enqueueSnackbar(error, { variant: "error" });
            setError('')
        }
    }, [error])

    return (
        <>
            <Stack
                spacing={1}
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
