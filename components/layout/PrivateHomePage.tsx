import { Box, Grid } from '@mui/material';
import { HodlFeed } from '../feed/HodlFeed';
import { HodlProfileBadge } from '../HodlProfileBadge';
import { TopAccounts } from '../rankings/TopAccounts';

export const PrivateHomePage = ({address}) => {
    return (
        
            <Grid
                container
            >
                <Grid
                    item xs={12}
                    md={7}
                >
                    <HodlFeed />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={5}
                >
                    <Box display="grid" gap={8} paddingY={4} paddingX={8} gridTemplateColumns="1fr">
                        <HodlProfileBadge address={address} />
                        <TopAccounts />
                    </Box>
                </Grid>
            </Grid>
    )
}