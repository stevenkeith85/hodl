import { Box, Typography } from '@mui/material';
import { TokenLinksList } from '../profile/TokenLinksList';
import { useContext } from 'react';
import { RankingsContext } from '../../contexts/RankingsContext';


export const NewTokens = ({ limit = 10, showLikes = true }) => {
    const { newTokens } = useContext(RankingsContext);

    return (
        <Box
            display={"grid"}
            sx={{
                gap: 2,
            }}>
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily }}>New NFTs</Typography>
            <TokenLinksList limit={limit} swr={newTokens} width={`100%`} showLikes={showLikes} />
        </Box>
    )
}
