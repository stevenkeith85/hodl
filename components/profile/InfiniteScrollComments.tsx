import { Box } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlComment } from "../HodlComment";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


interface InfiniteScrollCommentsProps {
  nft: any,
  swr: any,
  limit: number,
  canDeleteComment: Function,
  setCommentingOn: Function,
  addCommentInput: any,
  parentMutateCount: Function
}

export const InfiniteScrollComments: React.FC<InfiniteScrollCommentsProps> = ({ 
  nft, 
  swr, 
  limit, 
  canDeleteComment,
  setCommentingOn, 
  addCommentInput, 
  parentMutateCount }) => {
  if (swr.error) {
    return null;
  }

  if (!swr.data) {
    return null;
  }

  return (
    <InfiniteScroll
      swr={swr}
      loadingIndicator={<HodlLoadingSpinner />}
      isReachingEnd={
        swr => {
          return !swr.data[0]?.items?.length || swr.data[swr.data.length - 1]?.items?.length < limit
        }
      }
    >
      {
        ({ items, next, total }) => <Box key={next} display="flex" flexDirection="column" gap={1}>
          {
            (items || []).map(
              (comment, i) =>
                  <HodlComment 
                    nft={nft}
                    key={`hodl-comments-${comment.id}`} 
                    comment={comment} 
                    color={i % 2 ? 'primary' : 'secondary'}  
                    canDeleteComment={canDeleteComment} 
                    setCommentingOn={setCommentingOn}
                    addCommentInput={addCommentInput}
                    sx={{ flexGrow: 1 }} 
                    parentMutateList={swr.mutate}
                    parentMutateCount={parentMutateCount}
                  />
            )
          }
        </Box>
      }
    </InfiniteScroll>
  )
}