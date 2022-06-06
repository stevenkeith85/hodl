import { HighlightOffOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlComment } from "../HodlComment";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


interface InfiniteScrollCommentsProps {
  swr: any,
  limit: number,
  canDeleteComment: Function,
  deleteComment: Function
}

export const InfiniteScrollComments: React.FC<InfiniteScrollCommentsProps> = ({ swr, limit, canDeleteComment, deleteComment }) => {
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
          // console.log('reaching end ???', swr.data[swr.data.length - 1]?.items?.length < limit  )
          return !swr.data[0]?.items?.length || swr.data[swr.data.length - 1]?.items?.length < limit
        }
      }
    >
      {

        ({ items, next, total }) => <Box key={next}>
          {
            (items || []).map(
              (comment, i) =>
                <Box display="flex" alignItems="center" key={`hodl-comments-${comment.subject}-${comment.timestamp}`}>
                  <HodlComment comment={comment} color={i % 2 ? 'primary' : 'secondary'} sx={{ flexGrow: 1 }} />
                  {
                    canDeleteComment(comment) &&
                    <Box p={1} color="#999">
                      <HighlightOffOutlined sx={{ cursor: 'pointer' }} fontSize="small" onClick={() => deleteComment(comment)} />
                    </Box>
                  }
                </Box>
            )
          }
        </Box>
      }
    </InfiniteScroll>
  )
}