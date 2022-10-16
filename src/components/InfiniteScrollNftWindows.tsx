import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { NftWindow } from "./NftWindow";
import { FullToken } from "../models/Nft";
import { HodlLoadingSpinner } from "./HodlLoadingSpinner";

interface InfiniteScrollNftWindowsProps {
  swr: any,
  limit: number,
  pattern?: boolean
}

export const InfiniteScrollNftWindows: React.FC<InfiniteScrollNftWindowsProps> = ({ swr, limit, pattern = true }) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));


  return (
    <>

      <Box
        sx={{
          position: 'relative',
          display: "grid",
          gridTemplateColumns: {
            xs: `1fr 1fr`,
            sm: `1fr 1fr 1fr`,
          },
          gap: {
            xs: 1,
            sm: 1,
            md: 4
          }
        }}
      >
        <InfiniteScroll
          swr={swr}
          loadingIndicator={<>
            <HodlLoadingSpinner sx={{
              width: '300px',
              height: '300px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }} />
          </>
          }
          isReachingEnd={
            swr => {
              return swr.data?.[0]?.items?.length == 0 ||
                swr.data?.[swr.data?.length - 1]?.items?.length < limit
            }
          }
        >
          {
            ({ items, next, total }) => items.map((nft: FullToken, i) => <>
              {nft && <NftWindow nft={nft} key={nft.id} />}
            </>)
          }
        </InfiniteScroll >
      </Box >
    </>
  )
}