import Box from "@mui/material/Box";
import { Likes } from "../Likes";
import React from "react";
import { HodlCommentViewModel } from "../../models/HodlComment";


interface HodlCommentActionButtonsProps {
    comment: HodlCommentViewModel;
}

export const HodlCommentActionButtons: React.FC<HodlCommentActionButtonsProps> = ({
    comment,
}) => {


    return (<Box display="flex" alignItems="center" gap={1} marginX={1}>
        <Likes
            color="inherit"
            sx={{
                cursor: 'pointer',
                color: theme => theme.palette.text.secondary,
                '&:hover': {
                    color: theme => theme.palette.text.primary,
                }
            }}
            size={14}
            fontSize={12}
            id={comment.id}
            object="comment"
            showCount={true}
            prefetchedLikeCount={comment.likeCount}
        />
    </Box>)
}
