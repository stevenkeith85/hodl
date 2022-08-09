import { Box, Grid } from '@mui/material';
import { HodlFeed } from '../feed/HodlFeed';
import { HodlProfileBadge } from '../HodlProfileBadge';
import { NewTokens } from '../rankings/NewTokens';
import { TopUsers } from '../rankings/TopUsers';
import { TopTokens } from '../rankings/TopTokens';
import { NewUsers } from '../rankings/NewUsers';
import { HodlBorderedBox } from '../HodlBorderedBox';
import { User } from '../../models/User';


interface PrivateHomePageProps {
    user: User;
    address: string;
}

export const PrivateHomePage: React.FC<PrivateHomePageProps> = ({ user, address }) => {
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
                        paddingBottom: 4,
                        paddingY: {
                            sm: 4
                        },
                        paddingX: {
                            xs: 4,
                            sm: 8
                        },
                        gap: {
                            xs: 2,
                        }
                    }}
                >
                    <HodlProfileBadge user={user} />
                    <TopUsers />
                    <TopTokens />
                    <NewUsers />
                    <NewTokens />
                </Box>
            </Grid>
        </Grid>
    )
}