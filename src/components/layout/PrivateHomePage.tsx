import { Box, Grid } from '@mui/material';
import { HodlFeed } from '../feed/HodlFeed';
import { HodlProfileBadge } from '../HodlProfileBadge';
import { NewTokens } from '../rankings/NewTokens';
import { TopUsers } from '../rankings/TopUsers';
import { TopTokens } from '../rankings/TopTokens';
import { NewUsers } from '../rankings/NewUsers';
import { HodlBorderedBox } from '../HodlBorderedBox';
import { User, UserViewModel } from '../../models/User';
import { useEffect, useRef } from 'react';


interface PrivateHomePageProps {
    user: UserViewModel;
    address: string;
}

export const PrivateHomePage: React.FC<PrivateHomePageProps> = ({ user, address }) => {
    const previousNearestVideoToTop = useRef(null);
    const nearestVideoToTop = useRef(null);

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)

        );
    }

    // TODO: Review and optimise this. 
    // We get the closest video to the top of the screen 
    // pause the old closest video; and set the new one to play
    // if we haven't watched it before.
    //
    // if the video playing moves offscreen, we pause it
    //
    // TODO: We could probably skip this if the user disables video autoplay (still to do this)
    // TODO: We also need to consider the muted state

    useEffect(() => {
        const handleScroll = event => {
            console.log('window.scrollY', window.scrollY);

            previousNearestVideoToTop.current = nearestVideoToTop.current;

            nearestVideoToTop.current = [
                ...document.querySelectorAll('video').values()
            ].map(e => ({
                e,
                distance: e.getBoundingClientRect().top
            })
            ).sort(
                (a, b) => Math.abs(a.distance) < Math.abs(b.distance) ? -1 : 1
            )[0];

            if (nearestVideoToTop.current !== previousNearestVideoToTop) {
                previousNearestVideoToTop?.current?.e?.pause();

                if (!nearestVideoToTop?.current?.e?.ended) {
                    nearestVideoToTop?.current?.e?.play();
                }
            }

            if (!isInViewport(nearestVideoToTop.current.e)) {
                nearestVideoToTop?.current?.e?.pause();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
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