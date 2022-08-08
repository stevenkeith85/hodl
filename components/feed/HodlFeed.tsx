import { Box } from "@mui/material";
import { useContext } from "react";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { HodlFeedItem } from "./HodlFeedItem";
import { HodlAction } from "../../models/HodlAction";
import InfiniteScroll from "react-swr-infinite-scroll";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { FeedContext } from "../../contexts/FeedContext";


export const HodlFeed = ({ limit = 4 }) => {
    const { feed } = useContext(FeedContext);

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