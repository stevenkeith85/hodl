import { TokenLinksList } from '../profile/TokenLinksList';
import { useContext } from 'react';
import { RankingsContext } from '../../contexts/RankingsContext';
import { HodlScrollBox } from '../HodlScrollBox';


export const NewTokens = ({ limit = 10, showLikes = true }) => {
    const { newTokens } = useContext(RankingsContext);

    return (
        <HodlScrollBox title="new tokens">
            <TokenLinksList limit={limit} swr={newTokens} width={`100%`} showLikes={showLikes} />
        </HodlScrollBox>
    )
}
