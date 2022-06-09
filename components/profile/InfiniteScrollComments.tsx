import { Box } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlComment } from "../HodlComment";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


interface InfiniteScrollCommentsProps {
  swr: any,
  limit: number,
  canDeleteComment: Function,
  deleteComment: Function,
  setCommentingOn: Function
}

export const InfiniteScrollComments: React.FC<InfiniteScrollCommentsProps> = ({ swr, limit, canDeleteComment, deleteComment, setCommentingOn }) => {
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
                    key={`hodl-comments-${comment.id}`} 
                    comment={comment} 
                    color={i % 2 ? 'primary' : 'secondary'}  
                    canDeleteComment={canDeleteComment} 
                    deleteComment={deleteComment} 
                    setCommentingOn={setCommentingOn}
                    sx={{ flexGrow: 1 }} 
                  />
            )
          }
        </Box>
      }
    </InfiniteScroll>
  )
}