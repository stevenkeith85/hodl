import { UserLinksList } from '../profile/UserLinksList';
import { useContext } from 'react';
import { RankingsContext } from '../../contexts/RankingsContext';
import { HodlScrollBox } from '../HodlScrollBox';


export const NewUsers = ({ limit = 10, followButton=true }) => {
    const { newUsers } = useContext(RankingsContext);

    return (
        <HodlScrollBox title="New Users">
            <UserLinksList swr={newUsers} limit={limit} width={`100%`} followButton={followButton}/>
        </HodlScrollBox>
    )
}
