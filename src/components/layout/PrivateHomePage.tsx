import { Box, FormGroup, Grid, Switch, Tooltip, Typography } from '@mui/material';
import { HodlFeed } from '../feed/HodlFeed';
import { HodlProfileBadge } from '../HodlProfileBadge';
import { NewTokens } from '../rankings/NewTokens';
import { TopUsers } from '../rankings/TopUsers';
import { TopTokens } from '../rankings/TopTokens';
import { NewUsers } from '../rankings/NewUsers';
import { UserViewModel } from '../../models/User';
import { useEffect, useRef, useState } from 'react';
import { throttle } from '../../lib/lodash';


interface PrivateHomePageProps {
    user: UserViewModel;
    address: string;
}

export const PrivateHomePage: React.FC<PrivateHomePageProps> = ({ user, address }) => {

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
        console.log('nearest to top', nearestToTop.current)
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

    return (
        <>
            <Box
                sx={{
                    display: {
                        xs: 'flex',
                        md: 'none'
                    },
                    justifyContent: 'center'
                }}>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 1
                    }}
                >
                    
                    <Switch
                        checked={viewSidebar}
                        onChange={(e) => {
                            setViewSidebar(old => !old);
                        }
                        }
                    />


                </Box>
            </Box>
            <Grid
                container
            >

                <Grid
                    sx={{
                        display:
                        {
                            xs: !viewSidebar ? 'block' : 'none',
                            md: 'block'
                        }
                    }}
                    item xs={12}
                    md={7}
                >
                    <Box
                        sx={{
                            marginY: {
                                xs: 2,
                                md: 4,
                            },
                            marginX: {
                                xs: 0,
                                sm: 4
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
                        <HodlFeed address={address} />
                    </Box>
                </Grid>

                <Grid
                    sx={{
                        display: {
                            xs: viewSidebar ? 'block' : 'none',
                            md: 'block'
                        }
                    }}
                    item
                    xs={12}
                    md={5}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            marginY: {
                                xs: 2,
                                md: 4,
                            },
                            marginX: {
                                xs: 0,
                                sm: 4
                            },
                            marginTop: {
                                xs: 1,
                                md: 4
                            },
                            gap: 4,
                        }}
                    >
                        <HodlProfileBadge user={user} />
                        <TopUsers />
                        <TopTokens />
                        <NewUsers />
                        <NewTokens />
                    </Box>
                </Grid>

            </Grid>
        </>
    )
}