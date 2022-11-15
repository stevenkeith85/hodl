import Box from '@mui/material/Box';
import { Virtuoso } from 'react-virtuoso'
import { useActions2 } from '../../hooks/useActions2';
import { ActionSet } from "../../models/HodlAction";
import { HodlImpactAlert } from '../HodlImpactAlert';
import HodlFeedLoading from '../layout/HodlFeedLoading';
import { HodlFeedItem } from './HodlFeedItem';


export const HodlFeed2 = () => {
    const { data, error, setSize } = useActions2(ActionSet.Feed);

    const loadMore = () => {
        setSize(size => size + 1)
    };

    if (!data && !error) {
        return <HodlFeedLoading />
    }

    if (data?.[0] && data[0]?.total === 0) {
        return (
            <Box display="flex" flexDirection="column">
                <HodlImpactAlert message={"Follow some users to see what they are up to."} title="Your feed is currently empty" />
            </Box>
        )
    }

    return (<>
        <Virtuoso
            useWindowScroll
            data={data}
            overscan={700}
            endReached={loadMore}
            itemContent={(index, page) => page?.items.map((item, i) => <HodlFeedItem key={i} item={item} />)
            }
        />
    </>)
}