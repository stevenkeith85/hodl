import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar
} from "@mui/material";


interface UserDefaultAvatarProps {
    size: string;
}

export const UserDefaultAvatar: React.FC<UserDefaultAvatarProps> = ({ size }) => {
    return (
        <Avatar
            sx={{
                width: size,
                height: size,
                bgcolor: theme => theme.palette.secondary.light
            }}
        >
            <PersonIcon 
                sx={{
                    fontSize: `calc(${size} - 10px)`
                }}
            />
        </Avatar>
    )
}