import { Box, Typography } from '@mui/material';
import { UserLinksList } from '../profile/UserLinksList';
import { useSearchUsers } from '../../hooks/useSearchUsers';


export const NewUsers = ({ limit = 10, border=false }) => {
    const { results } = useSearchUsers('', 10);

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
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily}}>New Users</Typography>
            <UserLinksList swr={results} limit={limit} width={`100%`} />
        </Box>
    )
}
