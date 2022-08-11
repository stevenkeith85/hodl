import { Avatar } from "@mui/material";
import { ipfsUriToCid } from "../../lib/utils";
import { User } from "../../models/User";
import { HodlImage } from "../HodlImage";
import { HodlImageResponsive } from "../HodlImageResponsive";

interface UserAvatarProps {
    user: User;
    size: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size }) => {
    return (
        <Avatar
            sx={{
                width: size,
                height: size
            }}
        >
                <HodlImageResponsive
                    cid={user.avatar.image} 
                    widths={[size, size*2]}
                    sizes={size}
                    aspectRatio="1:1"
                    round={true}
                    gravity="g_face"
                />
        </Avatar>
    )
}

