import Link from "next/link";

import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import { UserViewModel } from "../../models/User";
import { UserHandle } from "./UserHandle";
import { UserDefaultAvatar } from "./UserDefaultAvatar";

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
        <Box
            sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: 14 }}>{user.nickname}</Typography>
            <Typography sx={{ fontSize: 12 }}>{getShortAddress(user.address)}</Typography>
        </Box>
    } arrow placement="right">
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}
        >
            {user.avatar ? <UserAvatar user={user} size={size} /> : <UserDefaultAvatar size={size} fontSize={size - 10} color={color} />}
            {handle ? <UserHandle user={user} fontSize={fontSize} /> : null}
        </Box>
    </Tooltip>
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
                <Link href={`/profile/${user.nickname || user.address}`} passHref>
                    <Typography sx={{
                        textDecoration: 'none',
                        color: theme => theme.palette.text.secondary
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
