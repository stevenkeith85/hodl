
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const HodlImpactAlert = ({ title, message, action = null, sx = null }) => {
    const theme = useTheme();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "center",
                textAlign: 'center',
                justifyItems: "center",
                padding: `${theme.spacing(16)} 0`,
                ...sx
            }}>
            <Typography mb={1} variant="h1" color="secondary">{title}</Typography>
            <Typography>{message}</Typography>
            {action}
        </div>
    )
}