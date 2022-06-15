import { Box } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlComment } from "../../models/HodlComment";
import { HodlCommentBox } from "../HodlCommentBox";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


interface InfiniteScrollCommentsProps {
  swr: any,
  limit: number,
  setCommentingOn: Function,
  addCommentInput: any,
  parentMutateCount: Function,
  setTopLevel?: any | null
}

export const InfiniteScrollComments: React.FC<InfiniteScrollCommentsProps> = ({
  swr,
  limit,
  setCommentingOn,
  addCommentInput,
  parentMutateCount,
  setTopLevel = null }) => {

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
              (comment: HodlComment, i: number) => 
                <HodlCommentBox
                  key={`hodl-comments-${comment.id}`}
                  comment={comment}
                  color={i % 2 ? 'primary' : 'secondary'}
                  setCommentingOn={setCommentingOn}
                  addCommentInput={addCommentInput}
                  parentMutateList={swr.mutate}
                  parentMutateCount={parentMutateCount}
                  setTopLevel={setTopLevel}
                />
            )
          }
        </Box>
      }
    </InfiniteScroll>
  )
}