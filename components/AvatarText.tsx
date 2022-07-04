import {
    Typography
} from "@mui/material";


interface AvatarTextProps { 
    size: "small" | "medium" | "large", 
    href?: string, 
    children?: any, 
    color: string 
}

export const AvatarText: React.FC<AvatarTextProps> = ({ size, href, children, color }) => {
    const mappings = {
        small: 14,
        medium: 14,
        large: 20
    }

    return (
        <Typography
            component="a"
            href={href}
            className="address"
            sx={{
                fontSize: mappings[size],
                textDecoration: 'none',
                color: color === 'greyscale' ? 'white' : '#000'
            }}>
            {children}
        </Typography>
    )
}
