import { Box, Grid } from '@mui/material';
import { HodlFeed } from '../feed/HodlFeed';
import { HodlProfileBadge } from '../HodlProfileBadge';
import { NewTokens } from '../rankings/NewTokens';
import { TopUsers } from '../rankings/TopUsers';
import { TopTokens } from '../rankings/TopTokens';
import { NewUsers } from '../rankings/NewUsers';
import { HodlBorderedBox } from '../HodlBorderedBox';
import { User, UserViewModel } from '../../models/User';
import { useEffect, useLayoutEffect, useRef } from 'react';


interface PrivateHomePageProps {
    user: UserViewModel;
    address: string;
}

export const PrivateHomePage: React.FC<PrivateHomePageProps> = ({ user, address }) => {

    const previousNearestVideoToTop = useRef(null);
    const nearestVideoToTop = useRef(null);

    function isInViewport(el) {
        if (!el) {
            return false;
        }

        const rect = el?.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)

        );
    }

    function throttle(func, timeFrame) {
        var lastTime = 0;
        return function (...args) {
            var now = new Date();
            if (now - lastTime >= timeFrame) {
                func(...args);
                lastTime = now;
            }
        };
      }

    // We get the closest video to the top of the screen 
    // pause the old closest video; and set the new one to play
    // if we haven't watched it before.
    //
    // if the video playing moves offscreen, we pause it
    //
    // TODO: We could probably skip this if the user disables video autoplay (still to do this)
    // TODO: We also need to consider the muted state
    const playVideoNearestTopOfViewport = () => {
        previousNearestVideoToTop.current = nearestVideoToTop.current;

        const allVideos = Array.from(document.querySelectorAll('video'));
        allVideos.sort(
            (a, b) => {
                const aPosition = Math.abs(a.getBoundingClientRect().top);
                const bPosition = Math.abs(b.getBoundingClientRect().top);

                if ( aPosition < bPosition ){
                    return -1;
                }
                else {
                    return 1;
                }
            }
        )[0];

        nearestVideoToTop.current = allVideos[0];
        const topVideoIsInViewport = isInViewport(nearestVideoToTop.current);

        // we have a new top video
        if (nearestVideoToTop.current !== previousNearestVideoToTop) {
            // pause the previous
            previousNearestVideoToTop?.current?.pause();

            // start the new one if we haven't already watched it and its 
            // in view
            if (!nearestVideoToTop?.current?.ended && topVideoIsInViewport) {
                ((nearestVideoToTop?.current) as HTMLMediaElement).muted = JSON.parse(localStorage.getItem('muted'));
                let playPromise = nearestVideoToTop?.current?.play();

                playPromise.then(() => {
                    console.log('playing ', nearestVideoToTop?.current)
                })
            }
        }

        // if the top video is no longer visible; pause it
        if (!topVideoIsInViewport) {
            nearestVideoToTop?.current?.pause();
        }
    };

    useEffect(() => {
        const fn = throttle(playVideoNearestTopOfViewport, 500);
        window.addEventListener('scroll', fn);

        return () => {
            window.removeEventListener('scroll', fn);
        };
    }, []);

    return (
        <Grid
            container
        >
            <Grid
                item xs={12}
                md={7}
            >
                <HodlFeed address={address} />
            </Grid>
            <Grid
                item
                xs={12}
                md={5}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    sx={{
                        marginY: 4,
                        marginX: {
                            lg: 8
                        },
                        gap: {
                            xs: 6,
                        },
                        alignItems: {
                            xs: 'center'
                        }
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
    )
}