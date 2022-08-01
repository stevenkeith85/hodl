import useSWR from "swr";
import axios from 'axios';
import { UserAvatarAndHandle } from "./UserAvatarAndHandle";


interface ProfileAvatarProps {
    address: string;
    size?: string;
    fontSize?: string;
    handle?: boolean;
    withLink?: boolean;
    color?: "primary" | "secondary" | "greyscale";
}

// This is the dynamic avatar that does an API call to get the user data
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    address,
    size = "44px",
    fontSize = "14px",
    handle = false,
    withLink = true,
    color="secondary"
}) => {

    if (!address) {
        return null;
    }

    const { data: user } = useSWR(
        [`/api/user`, address],
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.user)
    )

    if (!user) {
        return null;
    }

    return (
        <UserAvatarAndHandle 
            address={user.address} 
            fallbackData={user} 
            fontSize={fontSize} 
            size={size} 
            handle={handle} 
            withLink={withLink} 
            color={color} 
        />
    )
}
