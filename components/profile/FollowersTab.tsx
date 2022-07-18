import { Stack, Typography } from "@mui/material";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { HodlImpactAlert } from "../HodlImpactAlert";

interface FollowersTabProps {
  address: string, // current user
  profileAddress: string, // current profile we are on
  followers?: []
}

export const FollowersTab: React.FC<FollowersTabProps> = ({ followers, address, profileAddress }) => {
  const isOwnProfile = address === profileAddress;

    return (
      <Stack spacing={4} sx={{ padding: 0, paddingLeft: 0}}>
          { followers?.length ? 
              followers?.map((address, i) => <ProfileAvatar key={i} color="primary" profileAddress={address}/>) :
                <HodlImpactAlert title="No Followers" message="This user does not have any followers" sx={{ padding: 0 }}/>
          }
        </Stack>
    )
}
