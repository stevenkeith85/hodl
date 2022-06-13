import { Box } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useComments } from "../../hooks/useComments";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";


export const CommentThread = ({ nft, setCommentingOn, limit = 10, swr, addCommentInput, parentMutateCount }) => {
    const { address } = useContext(WalletContext);

    const canDeleteComment = (comment) => {
        return nft?.owner?.toLowerCase() === address?.toLowerCase() || comment.subject === address;
    }

    return (
        <Box>
            <InfiniteScrollComments
                nft={nft}
                swr={swr}
                limit={limit}
                canDeleteComment={canDeleteComment}
                setCommentingOn={setCommentingOn}
                addCommentInput={addCommentInput}
                parentMutateCount={parentMutateCount}
            />
        </Box>)
}