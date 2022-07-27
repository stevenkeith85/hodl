import { Box, Stack, Tooltip } from "@mui/material";
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

export const UserAvatarAndHandle: React.FC<UserAvatarProps> = ({ user, size="42px", fontSize="14px" }) => {

    return (
        <Link href={`/profile/${user.nickname || user.address}`}>
            <Tooltip title={user.address} arrow placement="right">
                <a>
                    <Box 
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            cursor: 'pointer'
                        }}
                    >
                        {user.avatar ? <UserAvatar user={user} size={size} /> : <UserDefaultAvatar size={size} />}
                        <UserHandle user={user} fontSize={fontSize} />
                    </Box>
                </a>
            </Tooltip>
        </Link>

    )
}
