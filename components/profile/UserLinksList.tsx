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
  width?: string
}

export const UserLinksList: React.FC<UserLinksListProps> = ({ swr, limit }) => {
  
  if (!swr?.data || !swr.data.length) {
    return null;
  }

  return (
      <Box
        display="flex"
        gap={2}
        flexDirection={"column"}
        marginBottom={-2}
      >
        <InfiniteScroll
          swr={swr}
          loadingIndicator={<HodlLoadingSpinner />}
          isReachingEnd={x =>
            !x.data[0].items.length ||
            x.data[x.data.length - 1]?.items.length < limit
          }
        >
          {
            ({ items }) => items.map((user: User) =>
              <Box
                display="flex"
                width={`100%`}
                alignItems="center"
                key={user.address}
                gap={4}
              >
                <Box flexGrow={1}>
                  <UserAvatarAndHandle 
                    address={user.address} 
                    fallbackData={user} 
                    size="40px" 
                    fontSize="14px" 
                  />
                </Box>
                <Box flexShrink={1}>
                  <FollowButton profileAddress={user.address} variant="text" />
                </Box>
              </Box>

            )
          }
        </InfiniteScroll>
      </Box>
  )
}