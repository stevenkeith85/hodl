import { useTheme } from "@mui/material/styles";

import CircularProgress from "@mui/material/CircularProgress";

export default function HodlFeedLoading() {
    const theme = useTheme();
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: theme.spacing(2)
        }}
        >
            <CircularProgress size={22} sx={{ margin: 2, color: '#ddd' }} />
        </div>
    )
}