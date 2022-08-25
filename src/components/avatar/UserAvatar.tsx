import { Avatar } from "@mui/material";
import { UserViewModel } from "../../models/User";
import { HodlImageResponsive } from "../HodlImageResponsive";

interface UserAvatarProps {
    user: UserViewModel;
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

