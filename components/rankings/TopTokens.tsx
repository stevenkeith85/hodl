import { Box, Typography } from '@mui/material';


import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { TokenLinksList } from '../profile/TokenLinksList';


export const TopTokens = ({ limit = 10, showLikes=true }) => {
    const { mostLiked } = useContext(RankingsContext);

    return (
        <Box
            display={"grid"}
            sx={{
                gap: 2,
            }}>
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily}}>Top NFTs</Typography>
            <TokenLinksList limit={limit} swr={mostLiked}  width={`100%`} showLikes={showLikes}/>
        </Box>
    )
}
