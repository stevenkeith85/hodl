import { Stack, Typography } from "@mui/material";
import { ProfileAvatar, ProfileAvatarMemo } from "../ProfileAvatar";

export const FollowingTab = ({ following, address, profileAddress }) => {
    return (
      <Stack spacing={4} sx={{ padding: 4, paddingLeft: 0}}>
      { following?.length ? 
          following.map((address,i) => 
            <ProfileAvatarMemo key={i} color="primary" profileAddress={address}/>  
          ) 
          :
          <Typography>{ 
            address === profileAddress ? 
            `You aren't following anyone`:
            `This user isn't following anyone`
          }</Typography>
        }
    </Stack>
    )
}