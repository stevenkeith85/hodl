import { Box, Typography } from '@mui/material';
import { UserLinksList } from '../profile/UserLinksList';
import { useContext } from 'react';
import { RankingsContext } from '../../contexts/RankingsContext';


export const NewUsers = ({ limit = 10}) => {
    const { newUsers } = useContext(RankingsContext);

    return (
        <Box
            display={"grid"}
            sx={{
                gap: 2,
            }}>
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily}}>New Users</Typography>
            <UserLinksList swr={newUsers} limit={limit} width={`100%`} />
        </Box>
    )
}
