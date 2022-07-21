import { Box, Stack, Typography } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import following from "../../pages/api/rankings";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { HodlProfileBadge } from "../HodlProfileBadge";
import { FollowButton } from "./FollowButton";

interface FollowingTabProps {
  following: SWRInfiniteResponse<any, any>;
  limit: number;
}

export const FollowingTab: React.FC<FollowingTabProps> = ({ following, limit }) => {
  return (<Box
    display="grid"
    gap={1}
    gridTemplateColumns="1fr"
    sx={{ maxHeight: '300px' }}
  >
    {following?.data && following?.data[0]?.items?.length === 0 && <HodlImpactAlert title="Not Following" message="This user does not follow anyone" sx={{ padding: 0 }}/>}

    {following.data &&
      <InfiniteScroll
        swr={following}
        loadingIndicator={<HodlLoadingSpinner />}
        isReachingEnd={following =>
          !following.data[0].items.length ||
          following.data[following.data.length - 1]?.items.length < limit
        }
      >
        {
          ({ items }) => items.map(address => <ProfileAvatar key={address} color="primary" profileAddress={address}/>)
        }
      </InfiniteScroll>
    }
  </Box>
  )
}