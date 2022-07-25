import { Box, Grid } from '@mui/material';
import { HodlFeed } from '../feed/HodlFeed';
import { HodlProfileBadge } from '../HodlProfileBadge';
import { TopAccounts } from '../rankings/TopAccounts';

export const PrivateHomePage = ({ address }) => {
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
                <Box
                    display="grid"
                    gridTemplateColumns="1fr"
                    sx={{
                        position: {
                            sm: "fixed"
                        },
                        paddingBottom: 4,
                        paddingY: {
                            sm: 4
                        },
                        paddingX: {
                            xs: 4,
                            sm: 8
                        },
                        gap: {
                            xs: 4,
                            // sm: 8
                        }
                    }}
                >
                    <HodlProfileBadge address={address} />
                    <TopAccounts />
                </Box>
            </Grid>
        </Grid>
    )
}