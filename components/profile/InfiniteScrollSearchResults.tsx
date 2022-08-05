import { Box } from "@mui/material";
import NftList from "../NftList";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

interface InfiniteScrollSearchResultsProps {
  swr: any,
  limit: number,
}

export const InfiniteScrollSearchResults: React.FC<InfiniteScrollSearchResultsProps> = ({ swr, limit }) => {
  return (
    <InfiniteScroll
      swr={swr}
      loadingIndicator={<HodlLoadingSpinner />}
      isReachingEnd={
        swr => {
          return swr.data?.[0]?.items?.length == 0 || 
                  swr.data?.[swr.data?.length - 1]?.items?.length < limit
        }
      }
    >
      {
        ({ items, next, total }) =>
          <Box marginY={2} key={next}>
            <NftList
              nfts={items}
            />
          </Box>
      }
    </InfiniteScroll>
  )
}