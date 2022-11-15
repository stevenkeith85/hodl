import Link from "next/link";


import { UserViewModel } from "../../models/User";

import { useUser } from "../../hooks/useUser";

import dynamic from 'next/dynamic';
import { UserAvatarAndHandleBodyLoading } from "./UserAvatarAndHandleBodyLoading";


interface UserAvatarProps {
    address: string;
    fallbackData?: UserViewModel;
    size?: number;
    fontSize?: number;
    handle?: boolean;
    withLink?: boolean;
    color?: "primary" | "secondary" | "greyscale";
}

export const UserAvatarAndHandle: React.FC<UserAvatarProps> = (({
    address,
    fallbackData = null,
    size = 44,
    fontSize = 14,
    handle = true,
    withLink = true,
    color = "secondary"
}) => {
    const UserAvatarAndHandleBody = dynamic(
        () => import('./UserAvatarAndHandleBody').then(mod => mod.UserAvatarAndHandleBody),
        {
            ssr: false,
            loading: () => <UserAvatarAndHandleBodyLoading size={size} handle={handle} />
        }
    );

    const { data: user } = useUser(address, fallbackData);

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