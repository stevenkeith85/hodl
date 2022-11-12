import dynamic from 'next/dynamic';

import { useEffect } from "react"

import { Virtuoso } from 'react-virtuoso'
import { useActions2 } from '../../hooks/useActions2';
import HodlFeedLoading from '../layout/HodlFeedLoading';

const HodlFeedItem = dynamic(
    () => import('./HodlFeedItem').then(mod => mod.HodlFeedItem),
    {
        ssr: false,
    }
);

export const HodlFeed2 = () => {

    const [actions, next, total, fetch] = useActions2();

    const loadMore = () => {
        fetch();
    };

    useEffect(() => {
        fetch()
    }, [])


    if (!actions) {
        return <HodlFeedLoading />
    }

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