import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Stack, Typography } from "@mui/material";

// This version will not do any HTTP requests
export const ProfileAvatarStatic = ({handle, reverse=false, size="medium", color="secondary"}) => {

    const getSize = () => {
        if (size === 'small') {
            return 30;
        }

        if (size === 'medium') {
            return 40;
        }

        if (size === 'large') {
            return 50;
        }
    }

    const getColor = theme => {
        if (color === 'primary') {
            return theme.palette.primary.light;
        }
         
         if (color === 'secondary') {
             return theme.palette.secondary.main;
         }

         if (color === 'greyscale') {
            return 'rgba(0,0,0,0.3)'
        }
    }

    return (
        <Link href={`/profile/${handle}`} passHref>            
            <Stack sx={{ 
                alignItems: "center",
                cursor: 'pointer',
                '&:hover': {
                    '.avatar': {
                        cursor: 'pointer',
                        bgcolor: 'white',
                        borderColor: theme => getColor(theme),
                    },
                    '.icon': {
                        color: theme => getColor(theme),
                        bgcolor:'white'
                    },
                    '.address': {
                        fontWeight: 900
                    }
                }
            }} 
            spacing={1} 
            direction={ reverse ? 'row-reverse': 'row'}
            >   
               <Avatar 
                className="avatar"
                sx={{
                        height: getSize(),
                        width: getSize(),
                        border: size === 'small' ? `1.5px solid` : `2px solid`,
                        bgcolor: (theme) => getColor(theme)
                        
                    }}>
                    <PersonIcon 
                        className="icon"
                        sx={{ 
                            color: 'rgba(255,255,255,0.85)', 
                            fontSize: getSize() - 10,
                        }}
                    />
                </Avatar>
                <Typography className="address" sx={{ fontWeight: color === 'primary' ? 400: 600 }}>{ handle }</Typography>
            </Stack>            
        </Link>
    )
}