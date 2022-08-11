import { Box } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { User } from "../../models/User";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { FollowButton } from "./FollowButton";

interface UserLinksListProps {
  swr: SWRInfiniteResponse<any, any>;
  limit: number;
  width?: string;
  followButton?: boolean;
}

export const UserLinksList: React.FC<UserLinksListProps> = ({ swr, limit, followButton = true }) => {

  if (!swr) {
    return null;
  }

  if (!swr.data) {
    return;
  }

  return (
    <Box
      display="flex"
      flexDirection={"column"}
    >
      <InfiniteScroll
        swr={swr}
        loadingIndicator={<HodlLoadingSpinner />}
        isReachingEnd={swr => {
          return swr.data?.[0]?.items?.length == 0 ||
            swr.data?.[swr.data?.length - 1]?.items?.length < limit
        }
        }
      >
        {
          ({ items }) => items.map((user: User) =>
            <Box
              display="flex"
              width={`100%`}
              alignItems="center"
              key={user?.address}
              gap={4}
              sx={{
                marginY: 1
              }}
            >
              <Box flexGrow={1}>
                <UserAvatarAndHandle
                  address={user?.address}
                  fallbackData={user}
                  size="40px"
                  fontSize="14px"
                />
              </Box>
              {followButton && <Box flexShrink={1}>
                <FollowButton profileAddress={user?.address} variant="text" />
              </Box>}
            </Box>
          )
        }
      </InfiniteScroll>
    </Box>
  )
}