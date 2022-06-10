import { Box } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useComments } from "../../hooks/useComments";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { InfiniteScrollComments } from "../profile/InfiniteScrollComments";


export const CommentThread = ({ nft, setLoading, setCommentingOn, prefetchedComments = null, prefetchedCommentCount = null, token = true, limit = 10 }) => {
    const { address } = useContext(WalletContext);

    const [swr] = useComments(
        nft.tokenId, 
        nft.tokenId, 
        limit, 
        setLoading, 
        "token", 
        prefetchedComments, 
        prefetchedCommentCount
    );

    const canDeleteComment = (comment) => {
        return nft?.owner?.toLowerCase() === address?.toLowerCase() || comment.subject === address;
    }

    return (
        <Box>
            {!swr.error && !swr.data && <Box sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}>
                <HodlLoadingSpinner />
            </Box>
            }
            <InfiniteScrollComments
                nft={nft}
                swr={swr}
                limit={limit}
                canDeleteComment={canDeleteComment}
                setCommentingOn={setCommentingOn}
            />
        </Box>)
}