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
                    display: 'block', 
                    background: 'rgba(255,255,255,0.9)', 
                    bottom: '0', 
                    fontSize: 14, 
                    color: '#666', 
                    fontWeight: 900}}>{ getShortAddress(address) }</Typography>}
            <Avatar sx={{
                height: 50,
                width: 50,
                
                bgcolor: (theme) => theme.palette.secondary.main,
                '&:hover': {
                    bgcolor: (theme) => theme.palette.secondary.dark,
                    cursor: 'pointer'
                }
            }}>
                
                <PersonIcon  sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 40 }}/>
                
            </Avatar>
            

            </Stack>
            
        </Link>
    )
}