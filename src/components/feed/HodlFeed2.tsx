import { useEffect } from "react"

import { Virtuoso } from 'react-virtuoso'
import { useActions2 } from '../../hooks/useActions2';
import { HodlFeedItem } from './HodlFeedItem';

export const HodlFeed2 = () => {

    const [actions, next, total, fetch] = useActions2();

    const loadMore = () => {
        fetch();
    };

    useEffect(() => {
        fetch()
    }, [])


    return (<>
        <Virtuoso
            useWindowScroll
            totalCount={total}
            overscan={600}
            data={actions}
            endReached={loadMore}
            itemContent={index => <HodlFeedItem item={actions[index]} />
            }
        />
    </>)
}