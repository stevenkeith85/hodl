import theme from '../../theme';
import Box from '@mui/material/Box';
import { HodlImpactAlert } from '../HodlImpactAlert';
import { useRankings } from '../../hooks/useRankings';
import { RocketLaunchIcon } from '../icons/RocketLaunchIcon';
import { UserLinksList } from '../profile/UserLinksList';


export const EmptyFeedOnboarding = () => {
    const { rankings: mostFollowed } = useRankings(true, 10, null);

    return (<>
        <Box display="flex" flexDirection="column" alignItems='center' justifyContent="center" mb={2}>
            <Box sx={{ margin: 2, width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RocketLaunchIcon
                    size={40}
                    fill={theme.palette.primary.main}
                />
            </Box>
            <HodlImpactAlert title="Your feed is empty" message={"Follow some users to see their nfts and listings"} sx={{ padding: ' 0 0 30px' }} />
        </Box>
        <UserLinksList swr={mostFollowed} limit={4} followButton={true} />
    </>)
}