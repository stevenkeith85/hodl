import { Box, Tooltip, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useLike } from "../hooks/useLike";
import { FC } from "react";
import humanize from "humanize-plus";
import { useLikeCount } from "../hooks/useLikeCount";

export interface LikesProps {
    id: number;
    object: "token" | "comment";
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
    object,
    color = "secondary",
    fontSize = '20px',
    showCount = true,
    prefetchedLikeCount = null,
    likeTooltip = "Like this",
    unlikeTooltip = "Unlike this",
    sx = {}
}) => {
    const [userLikesThisToken, toggleLike] = useLike(id, object);
    const likeCount = useLikeCount(id, object, prefetchedLikeCount);

    return (
        <>
            <Box
                display="flex"
                gap={0.75}
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
                {showCount && (likeCount != undefined) &&
                    <Typography sx={{ 
                        fontSize: `calc(${fontSize} - 8px)`
                    }}>{humanize.compactInteger(likeCount, 1)}</Typography>
                }
            </Box>
        </>
    )
}
