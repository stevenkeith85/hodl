import { Box } from "@mui/material";
import { Likes } from "../Likes";
import React, { useContext } from "react";
import { HodlCommentViewModel } from "../../models/HodlComment";
import { WalletContext } from "../../contexts/WalletContext";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { SWRResponse } from "swr";


interface HodlCommentActionButtonsProps {
    comment: HodlCommentViewModel;
    setCommentingOn: Function;
    swr: SWRInfiniteResponse;
    countSWR: SWRResponse;
    setShowThread: Function;
    color: "primary" | "secondary"
    addCommentInput: any;
    parentMutateList: Function;
    parentMutateCount: Function;
    mutateCount: Function;
}

export const HodlCommentActionButtons: React.FC<HodlCommentActionButtonsProps> = ({
    comment,
}) => {
    const { address } = useContext(WalletContext);

    return (<Box display="flex" alignItems="center" gap={1} marginX={1}>
        {address &&
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
            />
        }        
    </Box>)
}
