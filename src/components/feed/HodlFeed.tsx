import dynamic from 'next/dynamic';

import { Box } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";

import { HodlAction } from "../../models/HodlAction";

import { FeedContext } from "../../contexts/FeedContext";
import { useActions } from '../../hooks/useActions';
import { ActionSet } from '../../models/HodlAction';


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

export const HodlFeed = ({ limit = 4 }) => {
    const { actions: feed } = useActions(true, ActionSet.Feed, 8);

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
                    loadingIndicator={<HodlLoadingSpinner sx={{ textAlign: 'center', padding: 2 }} />}
                    isReachingEnd={swr => {
                        return swr.data?.[0]?.items?.length == 0 ||
                            swr.data?.[swr.data?.length - 1]?.items?.length < limit
                    }
                    }
                >
                    {
                        ({ items }) =>
                            (items || []).map((item: HodlAction) => <HodlFeedItem key={item.id} item={item} />)
                    }
                </InfiniteScroll>
            </Box>
        </FeedContext.Provider>
    )
}