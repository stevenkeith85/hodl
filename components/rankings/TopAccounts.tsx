import { Box, Typography } from '@mui/material';


import { HodlProfileBadge } from '../HodlProfileBadge';
import InfiniteScroll from 'react-swr-infinite-scroll';
import { HodlLoadingSpinner } from '../HodlLoadingSpinner';
import { RankingsContext } from '../../contexts/RankingsContext';
import { useContext } from 'react';
import { FollowButton } from '../profile/FollowButton';


export const TopAccounts = ({ limit = 10 }) => {
    const { rankings } = useContext(RankingsContext);

    return (
        <Box>
            <Typography variant='h2' mb={2}>Top accounts</Typography>
            <Box
                display="grid"
                gap={1}
                gridTemplateColumns="1fr"
                sx={{ maxHeight: '300px' }}
            >
                {rankings.data &&
                    <InfiniteScroll
                        swr={rankings}
                        loadingIndicator={<HodlLoadingSpinner />}
                        isReachingEnd={rankings =>
                            !rankings.data[0].items.length ||
                            rankings.data[rankings.data.length - 1]?.items.length < limit
                        }
                    >
                        {
                            ({ items }) => items.map(({ address, followers }) => <Box display="flex" alignItems="center">
                                <Box flexGrow={1} gap={4} display="flex" alignItems={"center"} justifyContent="space-between">
                                    <HodlProfileBadge address={address} minimized />
                                    <FollowButton profileAddress={address} variant={'text'} />
                                </Box>
                                {/* {followers} */}
                            </Box>
                            )
                        }
                    </InfiniteScroll>
                }
            </Box>
        </Box>
    )
}
