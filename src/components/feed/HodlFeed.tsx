import { useContext, useEffect, useState } from 'react';

import { FeedContext } from '../../contexts/FeedContext';
import { PusherContext } from '../../contexts/PusherContext';

import { HodlFeedItemLoading } from './HodlFeedItemLoading';

import dynamic from 'next/dynamic';

const EmptyFeedOnboarding = dynamic(
    () => import('./EmptyFeedOnboarding').then(mod => mod.EmptyFeedOnboarding),
    {
        ssr: true,
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

const HodlFeedItem = dynamic(
    () => import('./HodlFeedItem').then(mod => mod.HodlFeedItem),
    {
        ssr: true,
        loading: () => <HodlFeedItemLoading />
    }
);

const Virtuoso = dynamic(
    () => import('react-virtuoso').then(mod => mod.Virtuoso),
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
        return null
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
                    // @ts-ignore
                    itemContent={(index, page) => page?.items.map((item, i) => <HodlFeedItem key={i} item={item} />)
                    }
                />
            </div >
        </>)
}
