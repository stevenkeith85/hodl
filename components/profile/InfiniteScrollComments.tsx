import { HighlightOffOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlComment } from "../HodlComment";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { Likes } from "../Likes";


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
          return !swr.data[0]?.items?.length || swr.data[swr.data.length - 1]?.items?.length < limit
        }
      }
    >
      {
        ({ items, next, total }) => <Box key={next}>
          {
            (items || []).map(
              (comment, i) =>
                <Box display="flex" gap={1} alignItems="center" key={`hodl-comments-${comment.id}`} paddingRight={1}>
                  <HodlComment comment={comment} color={i % 2 ? 'primary' : 'secondary'} sx={{ flexGrow: 1 }} />
                  <Likes
                    id={comment.id}
                    token={false}
                    fontSize="inherit"
                  />
                  
                  {
                    canDeleteComment(comment) &&
                      <HighlightOffOutlined sx={{ cursor: 'pointer', color: '#999' }} fontSize="inherit" onClick={() => deleteComment(comment)} />                   
                  }
                  
                </Box>
            )
          }
        </Box>
      }
    </InfiniteScroll>
  )
}