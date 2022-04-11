import { Stack, Typography } from "@mui/material";
import { ProfileAvatarMemo } from "../ProfileAvatar";

interface FollowersTabProps {
  address: string, // current user
  profileAddress: string, // current profile we are on
  followers?: []
}

export const FollowersTab: React.FC<FollowersTabProps> = ({ followers, address, profileAddress }) => {
  const isOwnProfile = address === profileAddress;

    return (
      <Stack spacing={4} sx={{ padding: 4, paddingLeft: 0}}>
          { followers?.length ? 
              followers?.map((address, i) => <ProfileAvatarMemo key={i} color="primary" profileAddress={address}/>) :
              <Typography>{ isOwnProfile ? `You don't have any followers`: `This user has no followers`}</Typography>
          }
        </Stack>
    )
}
