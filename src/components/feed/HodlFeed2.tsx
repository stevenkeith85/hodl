import { useEffect, useState } from "react"

import { Virtuoso } from 'react-virtuoso'
import { useActions2 } from '../../hooks/useActions2';
import { ActionSet } from "../../models/HodlAction";
import { HodlFeedItem } from './HodlFeedItem';

export const HodlFeed2 = () => {
    const [items, setItems] = useState([])

    const swr = useActions2(ActionSet.Feed);

    const loadMore = () => {
        swr.setSize(size => size + 1)
    };

    useEffect(() => {
        if (swr?.data?.[swr?.size - 1]?.items?.length) {
            setItems(old => ([
                ...old, 
                ...swr?.data?.[swr?.size - 1]?.items
            ]));
        }
    }, [swr.data])

    if (!swr.data) {
        return null;
    }

    return (<>
        <Virtuoso
            useWindowScroll
            data={items}
            overscan={600}
            endReached={loadMore}
            itemContent={index => <HodlFeedItem item={items[index]} />}
        />
    </>)
}