import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { TokenLinksList } from '../profile/TokenLinksList';
import { HodlScrollBox } from '../HodlScrollBox';


export const TopTokens = ({ showLikes = true }) => {
    const { limit, mostLiked } = useContext(RankingsContext);

    return (
        <HodlScrollBox title="Top tokens">
            <TokenLinksList 
                limit={limit} 
                swr={mostLiked}  
                showLikes={showLikes}
        />
        </HodlScrollBox>
    )
}
