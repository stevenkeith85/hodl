import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { useActions } from "../../hooks/useActions";
import { HodlFeedItem } from "./HodlFeedItem";
import { ActionSet, HodlAction } from "../../models/HodlAction";
import InfiniteScroll from "react-swr-infinite-scroll";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { HodlProfileBadge } from "../HodlProfileBadge";


export const HodlFeed = ({
    limit = 4
}) => {
    const { address } = useContext(WalletContext);

    const { actions: feed } = useActions(true, ActionSet.Feed, limit);

    if (!address) {
        return null;
    }

    const menu = <Box
        sx={{
            padding: 4,
            alignItems: {
                xs: 'center',
            }
        }}
        display="flex"
        flexDirection="column"
        gap={4}
    >
        {
            feed.data && !feed.data[0].items.length &&
            (
                <Box display="flex" flexDirection="column">
                    {/* <Typography variant="h2" mb={2}>Feed</Typography> */}
                    <HodlImpactAlert message={"Follow some users to see what they are up to."} title="Your feed is currently empty" />
                    {/* <Typography variant="h2" mb={2}>Popular Users</Typography> */}

                </Box>
            )
        }


        {feed.data && <InfiniteScroll
            swr={feed}
            loadingIndicator={<HodlLoadingSpinner />}
            isReachingEnd={feed =>
                !feed.data[0].items.length ||
                feed.data[feed.data.length - 1]?.items.length < limit
            }
        >
            {
                ({ items }) => {
                    return (items || []).map((item: HodlAction) =>
                        <HodlFeedItem key={item.id} item={item} />
                    )
                }
            }
        </InfiniteScroll>}
    </Box>

    return (
        <>{menu}</>
    )
}