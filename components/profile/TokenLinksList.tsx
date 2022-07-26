import { Box, Typography } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { Likes } from "../Likes";
import { TokenLink } from "../token/TokenLink";
import { FollowButton } from "./FollowButton";

interface TokenLinksListProps {
  swr: SWRInfiniteResponse<any, any>;
  limit: number;
  width?: string
  showLikes?: boolean;
}

export const TokenLinksList: React.FC<TokenLinksListProps> = ({ swr, limit, showLikes = true }) => {

  if (swr?.data && swr?.data[0]?.items?.length === 0) {
    return null;
  }

  return (
    <>
      {swr.data &&
        <Box
          display="flex"
          gap={2}
          flexDirection={"column"}
        >
          <InfiniteScroll
            swr={swr}
            loadingIndicator={<HodlLoadingSpinner />}
            isReachingEnd={following =>
              !following.data[0].items.length ||
              following.data[following.data.length - 1]?.items.length < limit
            }
          >
            {
              ({ items }) => items.map(id =>
                <Box display="flex" width={`100%`} alignItems="center">
                  <Box flexGrow={1}>
                    <TokenLink id={id} />
                  </Box>
                  {showLikes && <Box flexShrink={1}>
                    <Likes id={id} token={true} />
                  </Box>
                  }
                </Box>
              )
            }
          </InfiniteScroll>
        </Box>
      }
    </>)
}