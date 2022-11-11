import { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';

import { UserViewModel } from '../../models/User';
import { throttle } from '../../lib/lodash';

import HodlFeedLoading from './HodlFeedLoading';
import PrivateHomePageSidebarLoading from './PrivateHomePageSidebarLoading';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ActionSet } from '../../models/HodlAction';
import { useActions } from '../../hooks/useActions';


// import { delayForDemo } from '../../lib/utils';
const HodlFeed = dynamic(
    () => import('../feed/HodlFeed').then(mod => mod.HodlFeed),
    // () => delayForDemo(import('../HodlProfileBadge').then(mod => mod.HodlProfileBadge)),
    {
        ssr: false,
        loading: () => <HodlFeedLoading />
    }
);

const PrivateHomePageSidebar = dynamic(
    () => import('./PrivateHomePageSidebar'),
    {
        ssr: false,
        loading: () => <PrivateHomePageSidebarLoading />
    }
);

const PrivateHomePageSwitch = dynamic(
    () => import('./PrivateHomePageSwitch'),
    {
        ssr: false,
        loading: () => <PrivateHomePageSidebarLoading />
    }
);

interface PrivateHomePageProps {
    user: UserViewModel;
    address: string;
}

const PrivateHomePage: React.FC<PrivateHomePageProps> = ({ user, address }) => {
    const limit = 8; // number of feed items to fetch
    const theme = useTheme();
    
    const desktop = useMediaQuery(theme.breakpoints.up('md'));

    const [viewSidebar, setViewSidebar] = useState(false);

    const previousNearestToTop = useRef(null);
    const nearestToTop = useRef(null);

    const updateNearestToTop = () => {
        previousNearestToTop.current = nearestToTop.current;

        const feedItems = Array.from(document.querySelectorAll('.feedItem'));
        feedItems.sort(
            (a, b) => {
                const aPosition = Math.abs(a.getBoundingClientRect().top);
                const bPosition = Math.abs(b.getBoundingClientRect().top);

                if (aPosition < bPosition) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
        )[0];

        nearestToTop.current = feedItems[0];
    }

    // We record the feed item at the top of the screen
    //
    // if there's a new item at the top of the screen, we
    // pause the old items media (if it had any playing)
    //
    // and start the new items media playing (if it has any)
    const playMediaAssetNearestTopOfViewport = () => {
        updateNearestToTop();

        // if we have a new top video
        if (nearestToTop.current !== previousNearestToTop.current) {
            // pause the previous
            const previousMedia = previousNearestToTop?.current?.querySelector('video,audio');
            previousMedia?.pause();


            // start the new one
            const nearestToTopAsset = nearestToTop?.current?.querySelector('video,audio');
            if (nearestToTopAsset) {
                ((nearestToTopAsset) as HTMLMediaElement).muted = JSON.parse(localStorage.getItem('muted'));
                nearestToTopAsset?.play();
            }
        }
    };

    useEffect(() => {
        const fn = throttle(playMediaAssetNearestTopOfViewport, 500);
        window.addEventListener('scroll', fn);

        return () => {
            window.removeEventListener('scroll', fn);
        };
    }, []);

    const { actions: feed } = useActions(true, ActionSet.Feed, limit);

    return (
        <>
            {!desktop && <PrivateHomePageSwitch viewSidebar={viewSidebar} setViewSidebar={setViewSidebar} />}
            <Grid container>
                <Grid
                    item
                    sx={{
                        display: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }
                    }}
                    xs={12}
                    md={7}
                >
                    {feed &&
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: `min(530px, 100%)`,
                                marginY: {
                                    xs: 2,
                                    md: 4,
                                },
                                marginX: {
                                    xs: 0,
                                },
                                marginTop: {
                                    xs: 1,
                                    md: 4
                                },
                                marginBottom: {
                                    xs: 0,
                                    sm: 4
                                },
                            }}>

                            <HodlFeed feed={feed} limit={limit} />
                        </Box>
                    }
                </Grid>
                {(desktop || viewSidebar) &&
                    <Grid item xs={12} md={5}>
                        <PrivateHomePageSidebar user={user} />
                    </Grid>
                }
            </Grid>
        </>
    )
}

export default PrivateHomePage
