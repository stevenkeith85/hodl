import { Box, Typography } from '@mui/material';


import { HodlProfileBadge } from '../HodlProfileBadge';
import InfiniteScroll from 'react-swr-infinite-scroll';
import { HodlLoadingSpinner } from '../HodlLoadingSpinner';
import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { FollowButton } from '../profile/FollowButton';
import { UserLinksList } from '../profile/UserLinksList';


export const TopUsers = ({ limit = 10, border=false }) => {
    const { mostFollowed: rankings } = useContext(RankingsContext);

    return (
        <Box
            display={"grid"}
            sx={{
                gap: 3,
                paddingX: 2,
                paddingY: 2,
                border: border ? '1px solid #ddd': 'none',
                borderRadius: 1,
            }}>
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily}}>Top Users</Typography>
            <UserLinksList swr={rankings} limit={limit} width={`100%`} />
        </Box>
    )
}
