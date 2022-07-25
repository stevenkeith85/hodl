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
        <Box
        display={"grid"}
        sx={{
            gap: 3,
            paddingX: 2,
            paddingY: 2,
            border: '1px solid #ddd',
            borderRadius: 1,
            // boxShadow: '0 0 2px 1px #eee'
        }}>
            <Typography variant='h2'>Top accounts</Typography>
            <AvatarLinksList swr={rankings} limit={limit} width={`100%`}/>
        </Box>
    )
}
