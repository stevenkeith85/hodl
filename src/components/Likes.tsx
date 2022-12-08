import { FC, useContext } from "react";

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useLikeCount } from "../hooks/useLikeCount";
import { useLike } from "../hooks/useLike";

import humanize from "humanize-plus";
import { useUserLikesObject } from "../hooks/useUserLikesObject";
import { WalletContext } from "../contexts/WalletContext";


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
    const { address } = useContext(WalletContext);

    const likeCount = useLikeCount(id, object, prefetchedLikeCount);
    const userLikesThisObject = useUserLikesObject(id, object);
    const toggleLike = useLike(id, object);

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

                    if (!address) {
                        return;
                    }

                    likeCount.mutate(old => {
                        console.log('old', old)
                        if (old === undefined) { // if we use a fallback value we seem to get 'undefined' as the old value for the mutate function
                            return userLikesThisObject?.data ? prefetchedLikeCount - 1 : prefetchedLikeCount + 1;
                        } else {
                            return userLikesThisObject?.data ? old - 1 : old + 1;
                        }
                    }, { revalidate: false });
                    userLikesThisObject.mutate(old => !old, { revalidate: false });

                    await toggleLike();
                }}
            >
                {
                    !userLikesThisObject.data ?
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
                {
                    showCount && likeCount?.data !== null && 
                    <Typography sx={{ fontSize, color }}>{humanize.compactInteger(likeCount?.data || 0, 1)}</Typography>
                }
            </Box>
        </>
    )
}
