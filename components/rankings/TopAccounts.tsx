import { Box, Typography } from '@mui/material';


import { HodlProfileBadge } from '../HodlProfileBadge';
import InfiniteScroll from 'react-swr-infinite-scroll';
import { HodlLoadingSpinner } from '../HodlLoadingSpinner';
import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { FollowButton } from '../profile/FollowButton';
import { AvatarLinksList } from '../profile/AvatarLinksList';


export const TopAccounts = ({ limit = 10 }) => {
    const { rankings } = useContext(RankingsContext);

    return (
        <Box>
            <Typography variant='h2' mb={4}>Top accounts</Typography>
            <AvatarLinksList swr={rankings} limit={limit} />
        </Box>
    )
}
