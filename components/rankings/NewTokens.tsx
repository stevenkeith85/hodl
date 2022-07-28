import { Box, Typography } from '@mui/material';

import { TokenLinksList } from '../profile/TokenLinksList';
import { useSearchTokens } from '../../hooks/useSearchTokens';


export const NewTokens = ({ limit = 10, showLikes = true }) => {
    const { results } = useSearchTokens('', 10);

    return (
        <Box
            display={"grid"}
            sx={{
                gap: 2,
            }}>
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily }}>New NFTs</Typography>
            <TokenLinksList limit={limit} swr={results} width={`100%`} showLikes={showLikes} />
        </Box>
    )
}
