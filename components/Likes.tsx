import { Box, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLike } from "../hooks/useLike";
import { FC } from "react";
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export interface LikesProps {
    id: number,
    token?: boolean,
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning",
    fontSize?: "small" | "inherit" | "large" | "medium",
    sx?: any
}

export const Likes: FC<LikesProps> = ({ id, token = true, color = "secondary", fontSize = 'small', sx = {} }) => {
    const [tokenLikesCount, userLikesThisToken, toggleLike] = useLike(id, token);

    return (
        <>
            <Box
                display="flex"
                gap={0.5}
                sx={{
                    color: color,
                    alignItems: "center",
                    cursor: 'pointer',
                    position: 'relative',
                    ...sx
                }}>
                {
                    !userLikesThisToken ?
                        <FavoriteBorderIcon onClick={toggleLike} color={color} fontSize={fontSize} /> :
                        <FavoriteIcon onClick={toggleLike} color={color} fontSize={fontSize} />
                }
                {tokenLikesCount < 1000 ?
                    <Typography>{tokenLikesCount}</Typography> :
                    <Typography sx={{span: {position: 'relative', top: '-6px', fontSize: '12px'} }}>1k<span>+</span></Typography>
                }
            </Box>
        </>
    )
}
