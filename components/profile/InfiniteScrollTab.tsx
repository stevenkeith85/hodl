import { Box, Stack } from "@mui/material";
import NftList from "../NftList";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

interface InfiniteScrollTabProps {
  swr: any,
  limit: number,
  showAvatar?: boolean,
  showName?: boolean
}

export const InfiniteScrollTab: React.FC<InfiniteScrollTabProps> = ({ swr, limit, showAvatar=true, showName=false }) => {
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
              <NftList nfts={items} />
            </Box>
        }
      </InfiniteScroll>
  )
}