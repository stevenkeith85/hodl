import Link from "next/link";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { UserViewModel } from "../../models/User";
import { UserHandle } from "./UserHandle";
import { UserDefaultAvatar } from "./UserDefaultAvatar";

import { UserAvatar } from "./UserAvatar";
import { useUser } from "../../hooks/useUser";


const UserAvatarAndHandleBody = ({ user, size, fontSize, handle, color }) => (<Box
    sx={{
        display: 'flex',
        cursor: 'pointer'
    }}
>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}
        >
            {user?.avatar ? <UserAvatar user={user} size={size} /> : <UserDefaultAvatar size={size} fontSize={size - 10} color={color} />}
            {handle ? <UserHandle user={user} fontSize={fontSize} /> : null}
        </Box>
</Box>)

interface UserAvatarProps {
    address: string;
    fallbackData?: UserViewModel;
    size?: number;
    fontSize?: number;
    handle?: boolean;
    withLink?: boolean;
    color?: "primary" | "secondary" | "greyscale";
}

export const UserAvatarAndHandle: React.FC<UserAvatarProps> = ({
    address,
    fallbackData = null,
    size = 44,
    fontSize = 14,
    handle = true,
    withLink = true,
    color = "secondary"
}) => {
    const { data: user } = useUser(address, fallbackData);

    if (!user) {
        return (<>
            <Skeleton width={size} height={size} variant="circular" animation="wave"></Skeleton>
            {handle && <Skeleton width={100} height={14} variant="text" animation="wave"></Skeleton>}
        </>
        )
    }

    return (<>
        {
            withLink ?
                <Link href={`/profile/${user?.nickname || user?.address}`}>
                    <UserAvatarAndHandleBody
                        user={user}
                        size={size}
                        fontSize={fontSize}
                        handle={handle}
                        color={color}
                    />
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
