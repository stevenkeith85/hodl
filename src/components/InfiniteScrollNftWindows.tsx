import { Box, useMediaQuery, useTheme } from "@mui/material";
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "./HodlLoadingSpinner";
import { NftWindow } from "./NftWindow";
import { Nft } from "../models/Nft";
import { useRef } from "react";

interface InfiniteScrollNftWindowsProps {
  swr: any,
  limit: number,
}

export const InfiniteScrollNftWindows: React.FC<InfiniteScrollNftWindowsProps> = ({ swr, limit }) => {

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));

  // TODO: Extract this logic to a hook.
  const getImageNumber = (i, next) => {
    const page = Math.ceil(+next / +limit) - 1;
    return page * limit + i + 1;
  }

  // We just count the number of images between large ones.
  // This varies depending on the number of columns
  // const numberOfImagesUntilNextLargeOne = xs ? [4, 2] : sm ? [7, 3] : [10, 4];
  const numberOfImagesUntilNextLargeOne = xs ? [4, 2] : [7, 3]

  let index = 0;
  let lastDoubleSizedNumber = 1;
  const result = {};

  const isDoubleSize = (i, next) => {
    const number = getImageNumber(i, next);

    if (result[number] !== undefined) {
      return result[number];
    }

    if (number === 1) {
      return true;
    }

    if (number - numberOfImagesUntilNextLargeOne[index] === lastDoubleSizedNumber) {
      index = ((index + 1) % numberOfImagesUntilNextLargeOne.length);
      lastDoubleSizedNumber = number;

      result[number] = true;

      return true;
    }

    result[number] = false;
    return false;
  }
  // end TODO


  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `1fr 1fr 1fr`,
          sm: `1fr 1fr 1fr 1fr`,
        },
        gap: {
          xs: 1,
          sm: 2,
          md: 3
        }
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
          ({ items, next, total }) => items.map((nft: Nft, i) => <>
            <Box
              key={nft.id}
              sx={{
                position: 'relative',
                display: 'flex',
                gridColumn: isDoubleSize(i, next) ? `span 2` : `auto`,
                gridRow: isDoubleSize(i, next) ? `span 2` : `auto`,
              }}
            >
              {/* Responsive skeleton */}
              < Box
                sx={{
                  position: 'relative',
                  zIndex: 0,

                  width: '100%',
                  paddingTop: `100%`,
                  height: 0,
                  maxHeight: `100%`,
                  overflow: 'hidden',
                  background: '#ccc',
                  animation: 'flicker 3s ease',
                  animationIterationCount: 'infinite',
                  animationFillMode: 'forwards',
                  opacity: 0,
                }}>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 1,
                  width: `100%`,
                }}>
                <NftWindow nft={nft} key={nft.id} />
              </Box>
            </Box>
          </>)
        }
      </InfiniteScroll >
    </Box >
  )
}