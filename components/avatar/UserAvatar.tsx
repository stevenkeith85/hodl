import { Avatar } from "@mui/material";
import { ipfsUriToCid } from "../../lib/utils";
import { User } from "../../models/User";
import { HodlImage } from "../HodlImage";

interface UserAvatarProps {
    user: User;
    size: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size }) => {
    return (
        <Avatar
            sx={{
                width: size,
                height: size
            }}
        >
                <HodlImage 
                    cid={user.avatar.image} 
                    width={size}
                    height={size}
                    sizes={size}
                    effect={user.avatar.filter}
                />
        </Avatar>
    )
}

