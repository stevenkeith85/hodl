import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { TokenLinksList } from '../profile/TokenLinksList';
import { HodlScrollBox } from '../HodlScrollBox';
import Typography from '@mui/material/Typography';

export const TopTokens = ({ showLikes = true, titleSize = 16,  height = 325, size=44, fontSize=14, titleMargin=2}) => {
    const { limit, mostLiked } = useContext(RankingsContext);

    return (
        <HodlScrollBox
            height={height}
            title={<Typography
                variant='h2'
                color="primary"
                sx={{
                    fontFamily: theme => theme.logo.fontFamily,
                    marginBottom: titleMargin,
                    padding: 0,
                    fontSize: titleSize
                }}>
                Top Polygon NFTs
            </Typography>
            }>
            <TokenLinksList
                limit={limit}
                swr={mostLiked}
                showLikes={showLikes}
                size={size}
                fontSize={fontSize}
            />
        </HodlScrollBox>
    )
}
