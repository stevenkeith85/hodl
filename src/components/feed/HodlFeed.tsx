import dynamic from 'next/dynamic';

import Box from "@mui/material/Box"
import InfiniteScroll from "react-swr-infinite-scroll";

import { FeedContext } from "../../contexts/FeedContext";
import { useActions } from '../../hooks/useActions';

import { ActionSet, HodlAction } from '../../models/HodlAction';

import HodlFeedLoading from '../layout/HodlFeedLoading';

const HodlFeedItem = dynamic(
    () => import('./HodlFeedItem').then(mod => mod.HodlFeedItem),
    {
        ssr: false,
        loading: () => null
    }
);

const HodlImpactAlert = dynamic(
    () => import('../HodlImpactAlert').then(mod => mod.HodlImpactAlert),
    {
        ssr: false,
        loading: () => null
    }
);

export const HodlFeed = ({ feed, limit = 8 }) => {

    const isReachingEnd = swr => {
        return swr.data?.[0]?.items?.length == 0 ||
            swr.data?.[swr.data?.length - 1]?.items?.length < limit
    }

    return (
        <FeedContext.Provider value={{ feed }}>
            <Box
                id="hodlfeed"
                sx={{
                    gap: {
                        xs: 2,
                        sm: 4
                    }
                }}
                display="flex"
                flexDirection="column"
            >
                {
                    feed?.data?.[0] && !feed?.data[0]?.items?.length &&
                    (
                        <Box display="flex" flexDirection="column">
                            <HodlImpactAlert message={"Follow some users to see what they are up to."} title="Your feed is currently empty" />
                        </Box>
                    )
                }
                <InfiniteScroll
                    swr={feed}
                    loadingIndicator={<HodlFeedLoading />}
                    isReachingEnd={isReachingEnd}
                >
                    {
                        ({ items }) =>
                            (items || []).map((item: HodlAction) => <>{item && <HodlFeedItem key={item.id} item={item} />}</>)
                    }
                </InfiniteScroll>
            </Box>
        </FeedContext.Provider>
    )
}