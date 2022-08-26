import { Box, Grid } from '@mui/material';
import { HodlFeed } from '../feed/HodlFeed';
import { HodlProfileBadge } from '../HodlProfileBadge';
import { NewTokens } from '../rankings/NewTokens';
import { TopUsers } from '../rankings/TopUsers';
import { TopTokens } from '../rankings/TopTokens';
import { NewUsers } from '../rankings/NewUsers';
import { HodlBorderedBox } from '../HodlBorderedBox';
import { User, UserViewModel } from '../../models/User';


interface PrivateHomePageProps {
    user: UserViewModel;
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
                <HodlFeed address={address}/>
            </Grid>
            <Grid
                item
                xs={12}
                md={5}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    sx={{
                        marginY: 4,
                        marginX: {
                            lg: 8
                        },
                        gap: {
                            xs: 6,
                        },
                        alignItems: {
                            xs: 'center'
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