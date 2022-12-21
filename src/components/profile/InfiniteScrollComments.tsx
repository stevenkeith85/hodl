import Box from "@mui/material/Box";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlCommentViewModel } from "../../models/HodlComment";
import { HodlCommentBox } from "../comments/HodlCommentBox";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


interface InfiniteScrollCommentsProps {
  swr: any,
  limit: number,
  addCommentInput: any,
}

export const InfiniteScrollComments: React.FC<InfiniteScrollCommentsProps> = ({
  swr,
  limit,
  addCommentInput,
}) => {

  return (
    <>
      <InfiniteScroll
        swr={swr}
        loadingIndicator={
          <HodlLoadingSpinner
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              padding: 1
            }} />
        }
        isReachingEnd={
          swr => {
            return swr.data?.[0]?.items?.length == 0 ||
              swr.data?.[swr.data?.length - 1]?.items?.length < limit
          }
        }
      >
        {
          ({ items, next }) => (
            <Box
              key={next}
              display="flex"
              flexDirection="column"
              gap={0}
              sx={{
                margin: `0 0 12px 0`
              }}>
              {
                (items || []).map(
                  (comment: HodlCommentViewModel, i: number) =>
                    <HodlCommentBox
                      key={`hodl-comments-${comment.id}`}
                      comment={comment}
                      color={i % 2 ? 'secondary' : 'primary'}
                      addCommentInput={addCommentInput}
                      parentMutateList={swr.mutate}
                    />
                )
              }
            </Box>
            )
        }
      </InfiniteScroll>
    </>
  )
}
