import { Stack, Typography } from "@mui/material";
import { ProfileAvatar } from "../avatar/ProfileAvatar";

interface FollowingTabProps {
  address: string, // current user
  profileAddress: string, // current profile we are on
  following?: []
}

export const FollowingTab: React.FC<FollowingTabProps> = ({ following, address, profileAddress }) => {
  const isOwnProfile = address === profileAddress;

    return (
      <Stack spacing={4} sx={{ padding: 4, paddingLeft: 0}}>
        { following?.length ? 
            following.map((address,i) => <ProfileAvatar key={i} color="primary" profileAddress={address}/>) :
            <Typography>{ isOwnProfile ? `You aren't following anyone`: `This user isn't following anyone`}</Typography>
        }
      </Stack>
    )
}