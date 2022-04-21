import { Box, Stack } from "@mui/material";
import NftList from "../NftList";
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

interface HodlingTabProps {
    profileAddress: string,
    prefetchedData?: [],
    lim?: number
}

export const HodlingTab: React.FC<HodlingTabProps> = ({ profileAddress, prefetchedData = null, lim = 10 }) => {
    const getKey = (index, previous) => {
        return [`/api/profile/hodling?address=${profileAddress}`, index * lim, lim];
    }

    const fetcher = async (key, offset, limit) => await fetch(`/api/profile/hodling?address=${profileAddress}&offset=${offset}&limit=${limit}`)
        .then(r => r.json())
        .then(json => json.data);
    const swr = useSWRInfinite(getKey, fetcher, { fallbackData: prefetchedData });

    return (
        <Stack spacing={4}>
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
                                viewSale={false}
                                showAvatar={false}
                            />
                        </Box>
                }
            </InfiniteScroll>
        </Stack>
    )
}