import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { DefaultAvatar } from "./DefaultAvatar";
import { User } from "../../models/User";
import { UserHandle } from "./UserHandle";
import { UserDefaultAvatar } from "./UserDefaultAvatar";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";


interface UserAvatarProps {
    user: User;
    size?: string;
    fontSize?: string;
}

export const UserAvatarAndHandle: React.FC<UserAvatarProps> = ({ user, size = "40px", fontSize = "14px" }) => {

    return (
        <Link href={`/profile/${user.nickname || user.address}`} passHref>
            <Typography component="a" sx={{ 
                textDecoration: 'none', 
                color: '#333'
                }}>
            <Box
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
                        {user.avatar ? <UserAvatar user={user} size={size} /> : <UserDefaultAvatar size={size} />}
                        <UserHandle user={user} fontSize={fontSize} />
                    </Box>
                </Tooltip>
            </Box>
            </Typography>
        </Link>

    )
}
