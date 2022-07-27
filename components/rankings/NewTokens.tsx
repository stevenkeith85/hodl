import { Box, Typography } from '@mui/material';

import { TokenLinksList } from '../profile/TokenLinksList';
import { useSearchTokens } from '../../hooks/useSearchTokens';


export const NewTokens = ({ limit = 10, border = false, showLikes = true }) => {
    const { results } = useSearchTokens('', 10);

    return (
        <Box
            display={"grid"}
            sx={{
                gap: 3,
                paddingX: 2,
                paddingY: 2,
                border: border ? '1px solid #ddd' : 'none',
                borderRadius: 1,
            }}>
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily }}>New NFTs</Typography>
            <TokenLinksList limit={limit} swr={results} width={`100%`} showLikes={showLikes} />
        </Box>
    )
}
