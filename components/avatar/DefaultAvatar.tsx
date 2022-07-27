import PersonIcon from '@mui/icons-material/Person';
import {
    Avatar
} from "@mui/material";


interface DefaultAvatarProps {
    size: number;
    color: "primary" | "secondary" | "greyscale";
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ size, color }) => {

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
            className="avatar"
            sx={{
                height: size,
                width: size,
                bgcolor: (theme) => getColor(theme),
                '&:hover': {
                    cursor: 'pointer',
                    bgcolor: 'white',
                    borderColor: theme => getColor(theme),
                    '.icon': {
                        color: theme => getColor(theme),
                        bgcolor: 'white'
                    }
                }
            }}>

            <PersonIcon
                className="icon"
                sx={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: size - 10,
                }}

            />
        </Avatar>
    )
}