import Link from "next/link";
import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar, Stack, Typography
} from "@mui/material";
import { getShortAddress } from "../lib/utils";
import { useState, useEffect, useContext } from "react";
import { isValidAddress } from "../lib/profile";
import { WalletContext } from "../pages/_app";

export const ProfileAvatar = ({profileAddress, reverse=false, size="medium", color="secondary"}) => {

    const { address, nickname } = useContext(WalletContext);

    const [profileNickname, setProfileNickname] = useState('');
    const [validAddress, setValidAddress] = useState(false);

    useEffect(async () => {
        if (address === profileAddress && nickname) {
            setProfileNickname(nickname);
            setValidAddress(true);
        } else {
            console.log("profileAddress is", profileAddress)
            const r = await fetch(`/api/nickname?address=${profileAddress}`);
            const json = await r.json();
            setProfileNickname(json.nickname);
            setValidAddress(await isValidAddress(profileAddress))        
        }
    }, [profileAddress]);

    
    useEffect(async () => {
        if (address === profileAddress && nickname) {
            setProfileNickname(nickname);
            setValidAddress(true);
        }
    }, [nickname]);
    

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
        <Link href={profileAddress ? `/profile/${profileNickname || profileAddress}` : ''} passHref>            
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
                        border: size === 'small' ? `1px solid` : `2px solid`,
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
            {
            profileAddress && 
            validAddress && (
                profileNickname ? 
                    <Typography className="address" sx={{ fontWeight: color === 'primary' ? 400: 600 }}>{ profileNickname }</Typography> : 
                    <Typography className="address" sx={{ fontWeight: color === 'primary' ? 400: 600 }}>{ getShortAddress(profileAddress)?.toLowerCase() }</Typography>
                )
            }
            </Stack>            
        </Link>
    )
}