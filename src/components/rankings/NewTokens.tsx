import { TokenLinksList } from '../profile/TokenLinksList';
import { useContext } from 'react';
import { RankingsContext } from '../../contexts/RankingsContext';
import { HodlScrollBox } from '../HodlScrollBox';
import Typography from '@mui/material/Typography';


export const NewTokens = ({ showLikes = true, titleSize = 16, height = 325, size=60, fontSize=14, titleMargin=3}) => {
    const { limit, newTokens } = useContext(RankingsContext);

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
                New Polygon NFTs
            </Typography>
            }>
            <TokenLinksList limit={limit} swr={newTokens} width={`100%`} showLikes={showLikes} size={size} fontSize={fontSize} />
        </HodlScrollBox>
    )
}
