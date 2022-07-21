import { Box, Typography } from "@mui/material";
import InfiniteScroll from "react-swr-infinite-scroll";
import { SWRInfiniteResponse } from "swr/infinite/dist/infinite";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { HodlImpactAlert } from "../HodlImpactAlert";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { FollowButton } from "./FollowButton";

interface AvatarLinksListProps {
  swr: SWRInfiniteResponse<any, any>;
  limit: number;
}

export const AvatarLinksList: React.FC<AvatarLinksListProps> = ({ swr, limit }) => {

  if (swr?.data && swr?.data[0]?.items?.length === 0) {
    return <Typography sx={{ padding: 2 }}>Nothing to see here</Typography>
  }

  return (<Box
    display="grid"
    gap={1}
    gridTemplateColumns="1fr"
    sx={{ maxHeight: '300px' }}
  >


    {swr.data &&
      <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap=" 16px 32px" alignItems="center" width="min-content">
        <InfiniteScroll
          swr={swr}
          loadingIndicator={<HodlLoadingSpinner />}
          isReachingEnd={following =>
            !following.data[0].items.length ||
            following.data[following.data.length - 1]?.items.length < limit
          }
        >
          {
            ({ items }) => items.map(address => <>

              <ProfileAvatar key={address} color="primary" profileAddress={address} size="small" />
              <div>
                <FollowButton profileAddress={address} variant="text" />
              </div>

            </>
            )
          }
        </InfiniteScroll>
      </Box>
    }
  </Box>
  )
}