import { Box, Typography } from '@mui/material';
import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { UserLinksList } from '../profile/UserLinksList';


export const TopUsers = ({ limit = 10 }) => {
    const { mostFollowed: rankings } = useContext(RankingsContext);

    return (
        <Box
            display={"grid"}
            sx={{
                gap: 2
            }}>
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily}}>Top Users</Typography>
            <Box
                sx={{
                    maxHeight: '210px',
                    overflow: 'auto'
                }}>
                <UserLinksList swr={rankings} limit={limit} width={`100%`} />
            </Box>
        </Box >
    )
}
