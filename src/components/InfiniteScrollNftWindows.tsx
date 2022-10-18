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

export const InfiniteScrollNftWindows: React.FC<InfiniteScrollNftWindowsProps> = ({ swr, limit }) => {
  const theme = useTheme();

  const isReachingEnd = swr => {
    const firstPageEmpty = swr.data?.[0]?.items?.length == 0;
    const lastPageNotFull = swr.data?.[swr.data?.length - 1]?.items?.length < limit;

    return firstPageEmpty || lastPageNotFull;
  }


  return (
    <>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: {
          xs: -0.5,
          sm: -1,
          md: -1.5,
          lg: -2,
        }
      }}>
        <InfiniteScroll
          swr={swr}
          isReachingEnd={isReachingEnd}
        >
            {
              ({ items }) => items.map((nft: FullToken) => <Box  key={nft.id} sx={{
                width: {
                  xs: '50%',
                  md: '33.3%'
                },
                padding: {
                  xs: 0.5,
                  sm: 1,
                  md: 1.5,
                  lg: 2
                }
              }}>
                {nft && <NftWindow nft={nft} />}
              </Box>
              )
            }
        </InfiniteScroll >
        {
          isReachingEnd(swr) ? null :
            <HodlLoadingSpinner
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingY: 4
              }} />
        }
      </Box>
    </>
  )
}