import { Box, Typography } from '@mui/material';
import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { UserLinksList } from '../profile/UserLinksList';
import { HodlScrollBox } from '../HodlScrollBox';

export const TopUsers = ({ followButton=true}) => {
    const { limit, mostFollowed: rankings } = useContext(RankingsContext);

    return (
        <HodlScrollBox title="Top users">
            <UserLinksList swr={rankings} limit={limit} width={`100%`} followButton={followButton}/>
        </HodlScrollBox>
    )
}
