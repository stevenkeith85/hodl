import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ProfileAvatar } from "../ProfileAvatar";

export const FollowingTab = ({ following, address }) => {
    const router = useRouter();

    return (
      <Stack spacing={4} sx={{ padding: 4, paddingLeft: 0}}>
      { following?.length ? 
          following.map((address,i) => 
            <ProfileAvatar key={i} color="primary" profileAddress={address}/>  
          ) 
          :
          <Typography>{ 
            address && 
            router.query?.address?.length && 
            address === router.query.address ? 
            `You aren't following anyone`:
            `This user isn't following anyone`
          }</Typography>
        }
    </Stack>
    )
}