import { Box, Typography } from '@mui/material';


import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { TokenLinksList } from '../profile/TokenLinksList';


export const TopTokens = ({ limit = 10, border=false, showLikes=true }) => {
    const { mostLiked } = useContext(RankingsContext);

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
            <Typography variant='h2' sx={{ fontFamily: theme => theme.logo.fontFamily}}>Top NFTs</Typography>
            <TokenLinksList limit={limit} swr={mostLiked}  width={`100%`} showLikes={showLikes}/>
        </Box>
    )
}
