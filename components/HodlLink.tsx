import { Typography } from "@mui/material";
import Link from "next/link";

export const HodlLink = ({href, children}) => (
    <Link href={href}>
        <Typography sx={{ 
            fontSize: 14, 
            '&:hover': {
                fontWeight: 900,
                cursor: 'pointer',
                color: (theme) => theme.palette.secondary.dark
            } }}>
                { children }
        </Typography>
    </Link>
)
