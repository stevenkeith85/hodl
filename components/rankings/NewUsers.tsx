import { UserLinksList } from '../profile/UserLinksList';
import { useContext } from 'react';
import { RankingsContext } from '../../contexts/RankingsContext';
import { HodlScrollBox } from '../HodlScrollBox';


export const NewUsers = ({ followButton=true }) => {
    const { limit, newUsers } = useContext(RankingsContext);

    return (
        <HodlScrollBox title="New users">
            <UserLinksList swr={newUsers} limit={limit} width={`100%`} followButton={followButton}/>
        </HodlScrollBox>
    )
}
