import { useContext, useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso'
import { FeedContext } from '../../contexts/FeedContext';
import { PusherContext } from '../../contexts/PusherContext';
import HodlFeedLoading from '../layout/HodlFeedLoading';
import { HodlFeedItem } from './HodlFeedItem';
import dynamic from 'next/dynamic';

const EmptyFeedOnboarding = dynamic(
    () => import('./EmptyFeedOnboarding').then(mod => mod.EmptyFeedOnboarding),
    {
        ssr: false,
        loading: () => null
    }
);

const MutateFeedButton = dynamic(
    () => import('./MutateFeedButton').then(mod => mod.MutateFeedButton),
    {
        ssr: false,
        loading: () => null
    }
);


export const HodlFeed = () => {
    const { feed } = useContext(FeedContext);
    const { pusher, userSignedInToPusher } = useContext(PusherContext);
    const [mutateButtonVisible, setMutateButtonVisible] = useState(false);

    const displayMutateButton = () => setMutateButtonVisible(true);

    useEffect(() => {
        if (!pusher || !userSignedInToPusher) {
            return;
        }

        pusher.user.bind("feed", displayMutateButton);

        return () => {
            pusher.user.unbind('feed', displayMutateButton);
        }

    }, [pusher, userSignedInToPusher]);

    const loadMore = () => {
        feed.setSize(size => size + 1)
    };

    if (!feed?.data && !feed?.error) {
        return <HodlFeedLoading />
    }

    if (feed?.data?.[0] && feed?.data[0]?.total === 0) {
        return <>
            {mutateButtonVisible && <MutateFeedButton setMutateButtonVisible={setMutateButtonVisible} />}
            <EmptyFeedOnboarding />
        </>
    }

    return (
        <>
            <div style={{ position: 'relative' }}>
                {mutateButtonVisible && <MutateFeedButton setMutateButtonVisible={setMutateButtonVisible} />}
                <Virtuoso
                    useWindowScroll
                    data={feed?.data}
                    overscan={700}
                    endReached={loadMore}
                    itemContent={(index, page) => page?.items.map((item, i) => <HodlFeedItem key={i} item={item} />)
                    }
                />
            </div >
        </>)
}