import { Box, Tooltip, Typography } from "@mui/material";
import { User } from "../../models/User";
import { UserHandle } from "./UserHandle";
import { UserDefaultAvatar } from "./UserDefaultAvatar";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import useSWR from "swr";
import axios from 'axios';
import { useUser } from "../../hooks/useUser";


const UserAvatarAndHandleBody = ({ user, size, fontSize, handle, color }) => (<Box
    sx={{
        display: 'flex',
        cursor: 'pointer'
    }}
>
    <Tooltip title={user.address} arrow placement="right">
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}
        >
            {user.avatar ? <UserAvatar user={user} size={size} /> : <UserDefaultAvatar size={size} color={color} />}
            {handle ? <UserHandle user={user} fontSize={fontSize} /> : null}
        </Box>
    </Tooltip>
</Box>)

interface UserAvatarProps {
    address: string;
    fallbackData?: User;
    size?: string;
    fontSize?: string;
    handle?: boolean;
    withLink?: boolean;
    color?: "primary" | "secondary" | "greyscale";
}

export const UserAvatarAndHandle: React.FC<UserAvatarProps> = ({
    address,
    fallbackData=null,
    size = "40px",
    fontSize = "14px",
    handle = true,
    withLink = true,
    color = "secondary"
}) => {

    // const { data: user } = useSWR(
    //     [`/api/user`, address],
    //     (url, query) => axios.get(`${url}/${query}`).then(r => r.data.user),
    //     { fallbackData }
    // )

    // if (!user) {
    //     return null;
    // }

    const {data: user} = useUser(address, fallbackData);
    if (!user) {
        return null;
    }

    return (<>
        {
            withLink ?
                <Link href={`/profile/${user.nickname || user.address}`} passHref>
                    <Typography component="a" sx={{
                        textDecoration: 'none',
                        color: '#333'
                    }}>
                        <UserAvatarAndHandleBody 
                            user={user} 
                            size={size} 
                            fontSize={fontSize} 
                            handle={handle} 
                            color={color} 
                        />
                    </Typography>
                </Link > :
                <UserAvatarAndHandleBody 
                    user={user} 
                    size={size} 
                    fontSize={fontSize} 
                    handle={handle} 
                    color={color} 
                />
        }
    </>)
}
