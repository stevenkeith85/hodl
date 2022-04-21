import { Box, Stack } from "@mui/material";
import NftList from "../NftList";
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

interface ListedTabProps {
  profileAddress: string,
  prefetchedData?: [],
  lim?: number
}

export const ListedTab: React.FC<ListedTabProps> = ({ profileAddress, prefetchedData = null, lim = 10 }) => {
  const getKey = (index, previous) => {
    return [`/api/profile/listed?address=${profileAddress}`, index * lim, lim];
  }

  const fetcher = async (key, offset, limit) => await fetch(`/api/profile/listed?address=${profileAddress}&offset=${offset}&limit=${limit}`)
    .then(r => r.json())
    .then(json => json.data);

  const swr = useSWRInfinite(getKey, fetcher, { fallbackData: prefetchedData });

  return (
    <Stack spacing={4} >

      <InfiniteScroll
        swr={swr}
        loadingIndicator={<HodlLoadingSpinner />}
        isReachingEnd={swr => swr.data?.[0]?.items.length === 0 || swr.data?.[swr.data?.length - 1]?.items.length < lim}
      >
        {
          ({ items }) =>
            <Box marginY={2}>
              <NftList
                nfts={items}
                showName={true}
                showAvatar={false} />
                </Box>
        }
      </InfiniteScroll>
    </Stack>
  )
}