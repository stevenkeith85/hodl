import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar, Stack, Typography
} from "@mui/material";
import { getShortAddress } from "../lib/utils";


export const ProfileAvatar = ({address}) => {
    return (
        <Link href={address ? `/profile/${address}` : ''} passHref>            
            <Stack sx={{ position: 'relative',}} spacing={0} direction="row" alignItems="center">
            { Boolean(address) && 
                <Typography sx={{ 
                    padding: 1,
                    bottom: '0',
                    }}>{ getShortAddress(address)?.toLowerCase() }</Typography>}
            <Avatar sx={{
                height: 40,
                width: 40,
                
                bgcolor: (theme) => theme.palette.secondary.main,
                '&:hover': {
                    bgcolor: (theme) => theme.palette.secondary.dark,
                    cursor: 'pointer'
                }
            }}>
                
                <PersonIcon  sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 30 }}/>
                
            </Avatar>
            

            </Stack>
            
        </Link>
    )
}