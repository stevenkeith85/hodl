import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { useNotifications } from "../../hooks/useNotifications";
import { HodlFeedItem } from "./HodlFeedItem";
import { NotificationTypes } from "../../models/HodlNotifications";


export const HodlFeed = ({ }) => {
    const { address } = useContext(WalletContext);

    const { notifications, isLoading, isError } = useNotifications(true);

    if (!address) {
        return <Typography>Connect Your Wallet To Get Started</Typography>;
    }

    const menu = <Box
        sx={{
            background: 'white',
            // border: `1px solid #ddd`,
            padding: 2,
            alignItems: {
                xs: 'center', 
                // md: 'start'
            }
        }}
        display="flex"
        flexDirection="column"
        gap={2}
    >
        {isLoading && <HodlLoadingSpinner />}
        {notifications && notifications.length === 0 && 'Nothing to see here...'}
        {(
            notifications &&
            notifications.filter(x => x.action === NotificationTypes.Added || x.action === NotificationTypes.Listed) || []
        ).map((item, i) =>
            <HodlFeedItem key={i} item={item} />
        )}
    </Box>

    return (
        <>{menu}</>
    )
}