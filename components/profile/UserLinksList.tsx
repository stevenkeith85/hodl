import { Box, Typography } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { User } from "../../models/User";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { UserAvatarAndHandle } from "../avatar/UserAvatarAndHandle";
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
            ({ items }) => items.map((user: User) => 
              <Box display="flex" width={`100%`} alignItems="center" key={user.address}>
                <Box flexGrow={1}>
                  <UserAvatarAndHandle user={user} />
                </Box>
                <Box flexShrink={1}>
                  <FollowButton profileAddress={user.address} variant="text" />
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