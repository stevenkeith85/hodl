import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { useNotifications } from "../../hooks/useNotifications";
import { HodlFeedItem } from "./HodlFeedItem";
import { ActionTypes } from "../../models/HodlAction";
import { RocketTitle } from "../RocketTitle";
import { HodlImpactAlert } from "../HodlImpactAlert";


export const HodlFeed = ({ }) => {
    const { address } = useContext(WalletContext);

    const { notifications, isLoading, isError } = useNotifications(true);

    if (!address) {
        return null;
    }

    const menu = <Box
        sx={{
            // background: 'white',
            // border: `1px solid #ddd`,
            padding: 2,
            alignItems: {
                xs: 'center',
                // md: 'start'
            }
        }}
        display="flex"
        flexDirection="column"
        gap={4}
    >
        {isLoading && <HodlLoadingSpinner />}
        {notifications && notifications.length === 0 && <HodlImpactAlert
            title="It's quiet around here"
            message="Follow some accounts to see their content"
        />}
        {(
            notifications &&
            notifications.filter(x => x.action === ActionTypes.Added || x.action === ActionTypes.Listed) || []
        ).map((item, i) =>
            <HodlFeedItem key={i} item={item} />
        )}
    </Box>

    return (
        <>{menu}</>
    )
}