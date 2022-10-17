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
    flexDirection="row",
    sx = {}
}) => {
    const {swr: likeCount} = useLikeCount(id, object, prefetchedLikeCount);
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
                {showCount && (likeCount != undefined) &&
                    <Typography sx={{ 
                        fontSize,
                        color
                    }}>{
                        humanize.compactInteger(likeCount?.data || 0, 1)
                        }</Typography>
                }
            </Box>
        </>
    )
}
