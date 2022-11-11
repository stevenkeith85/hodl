import PersonIcon from '@mui/icons-material/Person';
import Avatar from "@mui/material/Avatar";


interface UserDefaultAvatarProps {
    size: number;
    fontSize: number;
    color?: "primary" | "secondary" | "greyscale";
}

export const UserDefaultAvatar: React.FC<UserDefaultAvatarProps> = ({ size, fontSize, color="secondary" }) => {
    const getColor = theme => {
        const mappings = {
            primary: theme.palette.primary.light,
            secondary: theme.palette.secondary.main,
            greyscale: 'rgba(0,0,0,0.3)'
        }

        return mappings[color]
    }


    return (
        <Avatar
            sx={{
                width: size,
                height: size,
                bgcolor: (theme) => getColor(theme),
            }}
        >
            <PersonIcon sx={{ fontSize }} />
        </Avatar>
    )
}