import { Virtuoso } from 'react-virtuoso'
import { useActions2 } from '../../hooks/useActions2';
import { ActionSet } from "../../models/HodlAction";
import { HodlFeedItem } from './HodlFeedItem';

export const HodlFeed2 = () => {
    const swr = useActions2(ActionSet.Feed);

    const loadMore = () => {
        swr.setSize(size => size + 1)
    };

    if (!swr.data) {
        return null;
    }

    return (<>
        <Virtuoso
            useWindowScroll
            data={swr?.data}
            overscan={700}
            endReached={loadMore}
            itemContent={(index, page) => page?.items.map(item => <HodlFeedItem item={item} />) 
        }
        />
    </>)
}