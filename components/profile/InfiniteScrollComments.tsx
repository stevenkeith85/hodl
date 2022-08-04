import { Box } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlComment, HodlCommentViewModel } from "../../models/HodlComment";
import { HodlCommentBox } from "../comments/HodlCommentBox";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


interface InfiniteScrollCommentsProps {
  swr: any,
  limit: number,
  setCommentingOn: Function,
  addCommentInput: any,
  parentMutateCount: Function,
  setTopLevel?: any | null,
  mutateCount?: any | null,
}

export const InfiniteScrollComments: React.FC<InfiniteScrollCommentsProps> = ({
  swr,
  limit,
  setCommentingOn,
  addCommentInput,
  parentMutateCount,
  setTopLevel = null,
  mutateCount = null }) => {

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
        ({ items, next, total }) => <Box key={next} display="flex" flexDirection="column" gap={1.5} sx={{ margin: `0 0 12px 0`}}>
          {
            (items || []).map(
              (comment: HodlCommentViewModel, i: number) =>
                <HodlCommentBox
                  key={`hodl-comments-${comment.id}`}
                  comment={comment}
                  color={i % 2 ? 'secondary' : 'primary'}
                  setCommentingOn={setCommentingOn}
                  addCommentInput={addCommentInput}
                  parentMutateList={swr.mutate}
                  parentMutateCount={parentMutateCount}
                  setTopLevel={setTopLevel}
                  mutateCount={mutateCount}
                />
            )
          }
        </Box>
      }
    </InfiniteScroll>
  )
}