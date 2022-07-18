import { Box, Tooltip, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLike } from "../hooks/useLike";
import { FC } from "react";
import humanize from "humanize-plus";

export interface LikesProps {
    id: number;
    token?: boolean;
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning";
    fontSize?: string;
    showCount?: boolean;
    prefetchedLikeCount?: number | null;
    likeTooltip?: string;
    unlikeTooltip?: string;
    sx?: any;
}

export const Likes: FC<LikesProps> = ({
    id,
    token = true,
    color = "secondary",
    fontSize = '18px',
    showCount = true,
    prefetchedLikeCount = null,
    likeTooltip = "Like this",
    unlikeTooltip = "Unlike this",
    sx = {}
}) => {
    const [tokenLikesCount, userLikesThisToken, toggleLike] = useLike(id, token, prefetchedLikeCount);

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
                }}
                onClick={e => {
                    e.stopPropagation();
                    toggleLike();
                }}
            >
                {
                    !userLikesThisToken ?
                        <Tooltip title={likeTooltip}>
                            <FavoriteBorderIcon
                                color={color}
                                sx={{
                                    fontSize
                                }}
                            />
                        </Tooltip>
                        :
                        <Tooltip title={unlikeTooltip}>
                            <FavoriteIcon
                                color={color}
                                sx={{
                                    fontSize
                                }}
                            />
                        </Tooltip>
                }
                {showCount && (tokenLikesCount != undefined) &&
                    <Typography sx={{ 
                        fontSize: `calc(${fontSize} - 4px)`
                    }}>{humanize.compactInteger(tokenLikesCount, 1)}</Typography>
                }
            </Box>
        </>
    )
}
