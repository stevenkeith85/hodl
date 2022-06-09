import { Box } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useComments } from "../../hooks/useComments";
import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";

// Handles Comments About NFTs or Comments About Comments (AKA Replies)
export const CommentThread = ({ id, nft, setLoading, setCommentingOn, token = true, limit = 10 }) => {
    // TODO: We should look up the NFT here, rather than passing it down the prop tree?
    const { address } = useContext(WalletContext);

    // const swr = useReadComments(id, limit, null);
    const [swr, addComment, deleteComment] = useComments(id, limit, setLoading, token, null, null);

    const canDeleteComment = (comment) => {
        return nft?.owner?.toLowerCase() === address?.toLowerCase() || comment.subject === address;
    }

    return (
        <Box>
            <InfiniteScrollComments 
                swr={swr} 
                limit={limit} 
                canDeleteComment={canDeleteComment} 
                deleteComment={deleteComment} 
                setCommentingOn={setCommentingOn}
            />
        </Box>)
}