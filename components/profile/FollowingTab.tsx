import { Stack, Typography } from "@mui/material";
import { ProfileAvatar } from "../avatar/ProfileAvatar";
import { HodlImpactAlert } from "../HodlImpactAlert";

interface FollowingTabProps {
  address: string, // current user
  profileAddress: string, // current profile we are on
  following?: []
}

export const FollowingTab: React.FC<FollowingTabProps> = ({ following, address, profileAddress }) => {
    return (
      <Stack spacing={4} sx={{ padding: 0 }}>
        { following?.length ? 
            following.map((address,i) => <ProfileAvatar key={i} color="primary" profileAddress={address}/>) :
            <HodlImpactAlert title="Not Following" message="This user does not follow anyone" sx={{ padding: 0 }}/>
        }
      </Stack>
    )
}