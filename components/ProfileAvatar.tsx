import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar, Stack, Typography
} from "@mui/material";
import { getShortAddress } from "../lib/utils";


export const ProfileAvatar = ({address, reverse=false, following=false}) => {
    return (
        <Link href={address ? `/profile/${address}` : ''} passHref>            
            <Stack sx={{ 
                position: 'relative', 
                cursor: 'pointer',
                '&:hover': {
                    '.avatar': {
                        cursor: 'pointer',
                        bgcolor: 'white',
                        borderColor: (theme) => following ? theme.palette.primary.light : theme.palette.secondary.main,
                    },
                    '.icon': {
                        color: (theme) => following ? theme.palette.primary.light : theme.palette.secondary.main,
                        bgcolor:'white'
                    },
                    '.address': {
                        fontWeight: 900
                    }
                }
            }} 
            spacing={2} 
            direction={ reverse ? 'row-reverse': 'row'}
            alignItems="center">   
               <Avatar 
               className="avatar"
               sx={{
                    height: 40,
                    width: 40,
                    border: `2px solid`,
                    bgcolor: (theme) => following? theme.palette.primary.light : theme.palette.secondary.main,
                    
                }}>
                <PersonIcon 
                    className="icon"
                    sx={{ 
                        color: 'rgba(255,255,255,0.85)', 
                        fontSize: 30,
                    }}
                />
            </Avatar>
            { Boolean(address) &&
             <Typography className="address" sx={{ fontWeight: following ? 400: 600 }}>
                    { getShortAddress(address)?.toLowerCase() }</Typography>}
            </Stack>            
        </Link>
    )
}