import Link from "next/link";

import { UserViewModel } from "../../models/User";
import { useUser } from "../../hooks/useUser";
import { UserAvatarAndHandleBodyLoading } from "./UserAvatarAndHandleBodyLoading";
import { UserAvatarAndHandleBody } from "./UserAvatarAndHandleBody";


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

    const { data: user } = useUser(address, fallbackData);

    if (!user) {
        return <UserAvatarAndHandleBodyLoading size={size} handle={handle} />
    }

    return (<>
        {
            withLink ?
                <Link
                    style={{ textDecoration: 'none' }}
                    href={`/profile/${user?.nickname || user?.address}`}
                >
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