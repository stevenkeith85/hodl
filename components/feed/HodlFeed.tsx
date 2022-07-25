import { Box } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { HodlFeedItem } from "./HodlFeedItem";
import { HodlAction } from "../../models/HodlAction";
import InfiniteScroll from "react-swr-infinite-scroll";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { FeedContext } from "../../contexts/FeedContext";


export const HodlFeed = ({
    limit = 4
}) => {
    const { feed } = useContext(FeedContext);

    const menu = <Box
        sx={{
            paddingX: {
                xs: 4
            },
            
            paddingY: {
                xs: 4,
                sm:4
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
            feed.data && !feed.data[0].items.length &&
            (
                <Box display="flex" flexDirection="column">
                    <HodlImpactAlert message={"Follow some users to see what they are up to."} title="Your feed is currently empty" />
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
                    return (items || []).map((item: HodlAction) => <>
                        {item && <HodlFeedItem key={item.id} item={item} />}
                    </>
                    )
                }
            }
        </InfiniteScroll>}
    </Box>

    return (
        <>{menu}</>
    )
}