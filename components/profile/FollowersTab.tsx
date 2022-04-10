import { Stack, Typography } from "@mui/material";
import { ProfileAvatar, ProfileAvatarMemo } from "../ProfileAvatar";

export const FollowersTab = ({ followers, address, profileAddress }) => {
    return (
      <Stack spacing={4} sx={{ padding: 4, paddingLeft: 0}}>
          { followers?.length ? 
              followers?.map((address, i) => 
                <ProfileAvatarMemo key={i} color="primary" profileAddress={address}/>  
              ) 
              :
              <Typography>{ 
                address === profileAddress ? 
                `You don't have any followers`:
                `This user has no followers`
              }</Typography>
            }
        </Stack>
    )
}