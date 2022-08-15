import { Box } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { HodlFeedItem } from "./HodlFeedItem";
import { HodlAction } from "../../models/HodlAction";
import InfiniteScroll from "react-swr-infinite-scroll";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { FeedContext } from "../../contexts/FeedContext";
import Pusher from 'pusher-js';


export const HodlFeed = ({ address, limit = 4 }) => {
    const { feed } = useContext(FeedContext);

    // React strict mode calls useEffect twice now :( . This fixes it - TODO - Investigate
    const effectCalled = useRef(false);

    // Get real time updates about your feed! :)
    useEffect(() => {
        if (!address) {
            return;
        }
        
        if (effectCalled.current) {
            return;
        }

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER
        });

        const channel = pusher.subscribe(address);

        channel.bind('feed', () => {
            feed.mutate();
        });

        effectCalled.current = true;
    }, [address]);

    return (
        <Box
            sx={{
                paddingX: {
                    xs: 4
                },

                paddingY: {
                    xs: 4,
                    sm: 4
                },

                paddingBottom: {
                    xs: 0,
                    sm: 4,
                },

                alignItems: {
                    xs: 'center',
                },
                gap: {
                    xs: 4
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
                loadingIndicator={<HodlLoadingSpinner />}
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
    )
}