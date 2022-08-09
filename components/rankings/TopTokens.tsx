import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { TokenLinksList } from '../profile/TokenLinksList';
import { HodlScrollBox } from '../HodlScrollBox';


export const TopTokens = ({ limit = 10, showLikes = true }) => {
    const { mostLiked } = useContext(RankingsContext);

    return (
        <HodlScrollBox title="Top NFTs">
            <TokenLinksList limit={limit} swr={mostLiked}  width={`100%`} showLikes={showLikes}/>
        </HodlScrollBox>
    )
}
