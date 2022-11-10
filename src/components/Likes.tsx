import { FC } from "react";

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useLikeCount } from "../hooks/useLikeCount";
import { useLike } from "../hooks/useLike";

import humanize from "humanize-plus";
import Skeleton from "@mui/material/Skeleton";


export interface LikesProps {
    id: number;
    object: "token" | "comment";
    color?: "inherit" | "disabled" | "action" | "secondary" | "primary" | "error" | "info" | "success" | "warning";
    size?: number;
    fontSize?: number;
    showCount?: boolean;
    prefetchedLikeCount?: number | null;
    likeTooltip?: string;
    unlikeTooltip?: string;
    flexDirection?: "row" | "column";
    sx?: any;
}

export const Likes: FC<LikesProps> = ({
    id,
    object,
    color = "secondary",
    size = 22,
    fontSize = 14,
    showCount = true,
    prefetchedLikeCount = null,
    likeTooltip = "like",
    unlikeTooltip = "unlike",
    flexDirection = "row",
    sx = {}
}) => {
    const { swr: likeCount } = useLikeCount(id, object, prefetchedLikeCount);
    const [userLikesThisToken, toggleLike] = useLike(id, object, likeCount);

    return (
        <>
            <Box
                display="flex"
                flexDirection={flexDirection}
                gap={0.5}
                sx={{
                    color,
                    alignItems: "center",
                    cursor: 'pointer',
                    position: 'relative',
                    ...sx
                }}
                onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await toggleLike();
                }}
            >
                {
                    !userLikesThisToken ?
                        <Tooltip title={likeTooltip}>
                            <FavoriteBorderIcon
                                color={color}
                                sx={{
                                    fontSize: size
                                }}
                            />
                        </Tooltip>
                        :
                        <Tooltip title={unlikeTooltip}>
                            <FavoriteIcon
                                color={color}
                                sx={{
                                    fontSize: size
                                }}
                            />
                        </Tooltip>
                }
                {showCount && !likeCount?.data && <Skeleton variant="text"><Typography>0</Typography></Skeleton>}
                {showCount && likeCount?.data &&
                    <Typography sx={{ fontSize, color }}>{humanize.compactInteger(likeCount?.data || 0, 1)}</Typography>
                }
            </Box>
        </>
    )
}
