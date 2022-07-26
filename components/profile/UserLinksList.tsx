import { Box, Typography } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { FollowButton } from "./FollowButton";

interface UserLinksListProps {
  swr: SWRInfiniteResponse<any, any>;
  limit: number;
  width?: string
}

export const UserLinksList: React.FC<UserLinksListProps> = ({ swr, limit, width = "min-content" }) => {

  if (swr?.data && swr?.data[0]?.items?.length === 0) {
    return null;
  }

  return (<>
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
            ({ items }) => items.map(address =>
              <Box display="flex" width={`100%`} alignItems="center">
                <Box flexGrow={1}>
                  <ProfileAvatar key={address} color="primary" profileAddress={address} size="small" />
                </Box>
                <Box flexShrink={1}>
                  <FollowButton profileAddress={address} variant="text" />
                </Box>
              </Box>
            )
          }
        </InfiniteScroll>
      </Box>
    }
  </>
  )
}