import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ProfileAvatar } from "../ProfileAvatar";

export const FollowersTab = ({ followers, address }) => {
    const router = useRouter();

    return (
      <Stack spacing={4} sx={{ padding: 4, paddingLeft: 0}}>
          { followers?.length ? 
              followers.map((address,i) => 
                <ProfileAvatar key={i} color="primary" profileAddress={address}/>  
              ) 
              :
              <Typography>{ 
                address && 
                router.query?.address?.length && 
                address === router.query.address ? 
                `You don't have any followers`:
                `This user has no followers`
              }</Typography>
            }
        </Stack>
    )
}