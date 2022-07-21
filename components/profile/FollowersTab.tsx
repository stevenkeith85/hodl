import { Stack, Typography } from "@mui/material";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { HodlImpactAlert } from "../HodlImpactAlert";

interface FollowersTabProps {
  followers?: []
}

export const FollowersTab: React.FC<FollowersTabProps> = ({ followers }) => {
    return (
      <Stack spacing={4} sx={{ padding: 0, paddingLeft: 0}}>
          { followers?.length ? 
              followers?.map((address, i) => <ProfileAvatar key={i} color="primary" profileAddress={address}/>) :
                <HodlImpactAlert title="No Followers" message="This user does not have any followers" sx={{ padding: 0 }}/>
          }
        </Stack>
    )
}
