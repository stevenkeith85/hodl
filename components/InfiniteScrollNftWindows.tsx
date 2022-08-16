import { Box } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "./HodlLoadingSpinner";
import { NftWindow } from "./NftWindow";
import { Nft } from "../models/Nft";

interface InfiniteScrollNftWindowsProps {
  swr: any,
  limit: number,
}

export const InfiniteScrollNftWindows: React.FC<InfiniteScrollNftWindowsProps> = ({ swr, limit }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs:`1fr`,
          sm:`1fr 1fr`,
          md: `1fr 1fr 1fr`,
      },
        gap: 4
      }}
    >
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
          ({ items, next, total }) => items.map((nft: Nft) => <NftWindow nft={nft} key={nft.id}/>)
        }
      </InfiniteScroll>
    </Box>
  )
}