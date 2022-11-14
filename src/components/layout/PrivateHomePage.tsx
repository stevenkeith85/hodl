import { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { UserViewModel } from '../../models/User';
import { throttle } from '../../lib/lodash';

import HodlFeedLoading from './HodlFeedLoading';
import PrivateHomePageSidebarLoading from './PrivateHomePageSidebarLoading';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PrivateHomePageSwitchLoading from './PrivateHomePageSwitchLoading';
import { useActions2 } from '../../hooks/useActions2';
// import { HodlFeed2 } from '../feed/HodlFeed2';


// import { delayForDemo } from '../../lib/utils';
const HodlFeed2 = dynamic(
    () => import('../feed/HodlFeed2').then(mod => mod.HodlFeed2),
    // () => delayForDemo(import('../HodlProfileBadge').then(mod => mod.HodlProfileBadge)),
    {
        ssr: false,
        loading: () => <HodlFeedLoading />
    }
);



const PrivateHomePageSwitch = dynamic(
    () => import('./PrivateHomePageSwitch'),
    {
        ssr: false,
        loading: () => <PrivateHomePageSwitchLoading />
    }
);

interface PrivateHomePageProps {
    user: UserViewModel;
    address: string;
}

const PrivateHomePage: React.FC<PrivateHomePageProps> = ({ user, address }) => {
    const theme = useTheme();

    const desktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

    const [viewSidebar, setViewSidebar] = useState(false);

    const previousNearestToTop = useRef(null);
    const nearestToTop = useRef(null);

    const PrivateHomePageSidebar = dynamic(
        () => import('./PrivateHomePageSidebar'),
        {
            ssr: false,
            loading: () => <PrivateHomePageSidebarLoading display={desktop || viewSidebar}/>
        }
    );

    // TODO: IS THIS EATING UP OUR CLOUDINARY BANDWIDTH??
    
    // const updateNearestToTop = () => {
    //     previousNearestToTop.current = nearestToTop.current;

    //     const feedItems = Array.from(document.querySelectorAll('.feedItem'));
    //     feedItems.sort(
    //         (a, b) => {
    //             const aPosition = Math.abs(a.getBoundingClientRect().top);
    //             const bPosition = Math.abs(b.getBoundingClientRect().top);

    //             if (aPosition < bPosition) {
    //                 return -1;
    //             }
    //             else {
    //                 return 1;
    //             }
    //         }
    //     )[0];

    //     nearestToTop.current = feedItems[0];
    // }

    // // We record the feed item at the top of the screen
    // //
    // // if there's a new item at the top of the screen, we
    // // pause the old items media (if it had any playing)
    // //
    // // and start the new items media playing (if it has any)
    // const playMediaAssetNearestTopOfViewport = () => {
    //     updateNearestToTop();

    //     // if we have a new top video
    //     if (nearestToTop.current !== previousNearestToTop.current) {
    //         // pause the previous
    //         const previousMedia = previousNearestToTop?.current?.querySelector('video,audio');
    //         previousMedia?.pause();


    //         // start the new one
    //         const nearestToTopAsset = nearestToTop?.current?.querySelector('video,audio');
    //         if (nearestToTopAsset) {
    //             ((nearestToTopAsset) as HTMLMediaElement).muted = JSON.parse(localStorage.getItem('muted'));
    //             nearestToTopAsset?.play();
    //         }
    //     }
    // };

    // useEffect(() => {
    //     const fn = throttle(playMediaAssetNearestTopOfViewport, 500);
    //     window.addEventListener('scroll', fn);

    //     return () => {
    //         window.removeEventListener('scroll', fn);
    //     };
    // }, []);
    
    return (
        <>
            {!desktop && <PrivateHomePageSwitch viewSidebar={viewSidebar} setViewSidebar={setViewSidebar}/>}
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
                    {(desktop || !viewSidebar) &&
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
                            <HodlFeed2 />
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
