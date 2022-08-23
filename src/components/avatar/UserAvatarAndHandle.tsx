import { Box, Tooltip, Typography } from "@mui/material";
import { UserViewModel } from "../../models/User";
import { UserHandle } from "./UserHandle";
import { UserDefaultAvatar } from "./UserDefaultAvatar";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { useUser } from "../../hooks/useUser";
import { getShortAddress } from "../../lib/utils";


const UserAvatarAndHandleBody = ({ user, size, fontSize, handle, color }) => (<Box
    sx={{
        display: 'flex',
        cursor: 'pointer'
    }}
>
    <Tooltip title={
        user.nickname || getShortAddress(user.address)
    } arrow placement="right">
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
            }}
        >
            {user.avatar ? <UserAvatar user={user} size={size} /> : <UserDefaultAvatar size={size} color={color} />}
            {handle ? <UserHandle user={user} fontSize={fontSize} /> : null}
        </Box>
    </Tooltip>
</Box>)

interface UserAvatarProps {
    address: string;
    fallbackData?: UserViewModel;
    size?: number;
    fontSize?: string;
    handle?: boolean;
    withLink?: boolean;
    color?: "primary" | "secondary" | "greyscale";
}

export const UserAvatarAndHandle: React.FC<UserAvatarProps> = ({
    address,
    fallbackData = null,
    size = 44,
    fontSize = "14px",
    handle = true,
    withLink = true,
    color = "secondary"
}) => {
    const { data: user } = useUser(address, fallbackData);

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
