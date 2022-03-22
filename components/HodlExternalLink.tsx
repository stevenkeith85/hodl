import { Link } from "@mui/material";

export const HodlExternalLink = ({ href, children }) => (
    <Link
        href={href}
        target="_blank"
        sx={{
            fontSize: 14, 
            textDecoration: 'none', 
            '&:hover': {
                fontWeight: 500
                } 
            }}
        >
        { children }
    </Link>
)