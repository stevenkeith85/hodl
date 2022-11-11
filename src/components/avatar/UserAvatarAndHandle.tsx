import dynamic from 'next/dynamic';
import Link from "next/link";

import Skeleton from "@mui/material/Skeleton";

import { UserViewModel } from "../../models/User";

import { useUser } from "../../hooks/useUser";
import theme from '../../theme';
import { AvatarLoadingMemo } from './AvatarLoading';
import { memo } from 'react';


const UserAvatarAndHandleBody = ({ user, size, fontSize, handle, color }) => {

    const UserAvatar = dynamic(
        () => import('./UserAvatar').then(mod => mod.UserAvatar),
        {
            ssr: false,
            loading: () => <AvatarLoadingMemo size={size} />
        }
    );

    const UserDefaultAvatar = dynamic(
        () => import('./UserDefaultAvatar').then(mod => mod.UserDefaultAvatar),
        {
            ssr: false,
            loading: () => <AvatarLoadingMemo size={size} />
        }
    );

    const UserHandle = dynamic(
        () => import('./UserHandle').then(mod => mod.UserHandle),
        {
            ssr: false,
            loading: () => <Skeleton variant="text" animation="wave" width={50}></Skeleton>
        }
    );
    

    return (
        <div
            style={{
                display: 'flex',
                cursor: 'pointer'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                }}
            >
                {
                    user?.avatar ?
                        <UserAvatar user={user} size={size} /> :
                        <UserDefaultAvatar size={size} fontSize={size - 10} color={color} />
                }
                {
                    handle ?
                        <UserHandle user={user} fontSize={fontSize} /> : null
                }
            </div>
        </div>
    )
}

interface UserAvatarProps {
    address: string;
    fallbackData?: UserViewModel;
    size?: number;
    fontSize?: number;
    handle?: boolean;
    withLink?: boolean;
    color?: "primary" | "secondary" | "greyscale";
}

export const UserAvatarAndHandle: React.FC<UserAvatarProps> = memo(({
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
            <AvatarLoadingMemo size={size} />
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
})

UserAvatarAndHandle.displayName = "UserAvatarAndHandle"