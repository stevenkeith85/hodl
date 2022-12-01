import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { useContext, useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso'
import { FeedContext } from '../../contexts/FeedContext';
import { PusherContext } from '../../contexts/PusherContext';
import { HodlImpactAlert } from '../HodlImpactAlert';
import HodlFeedLoading from '../layout/HodlFeedLoading';
import { HodlFeedItem } from './HodlFeedItem';


export const HodlFeed2 = () => {
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

    return (
        <>
            {
                feed?.data?.[0] && feed?.data[0]?.total === 0 &&
                <Box display="flex" flexDirection="column" alignItems='center' justifyContent="center">
                    <HodlImpactAlert message={"Follow some users to see what they are up to."} title="Your feed is currently empty" sx={{ padding: '100px 0' }}/>
                </Box>
            }
            <div style={{ position: 'relative' }}>
                {mutateButtonVisible && <Box sx={{
                    position: 'fixed',
                    zIndex: 300,
                    width: '530px',
                    maxWidth: '90%',
                    top: `110px`,
                }}>
                    <Fab
                        size="small"
                        color="secondary"
                        variant='extended'
                        sx={{
                            position: 'absolute',
                            right: 0,
                            left: 0,
                            width: '150px',
                            marginX: 'auto',
                            textTransform: 'none'

                        }}
                        onClick={() => {
                            feed.mutate();
                            setMutateButtonVisible(false);
                        }}>
                       <RefreshIcon sx={{ mr: 1 }} /> New items
                    </Fab>
                </Box>}
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