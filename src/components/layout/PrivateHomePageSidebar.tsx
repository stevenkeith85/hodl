import { useFollowersCount } from '../../hooks/useFollowersCount';
import { useFollowingCount } from '../../hooks/useFollowingCount';
import { useHodlingCount } from '../../hooks/useHodlingCount';
import { useListedCount } from '../../hooks/useListedCount';

import { useRankings } from '../../hooks/useRankings';
import { RankingsContext } from '../../contexts/RankingsContext';
import { useNewUsers } from '../../hooks/useNewUsers';
import { useNewTokens } from '../../hooks/useNewTokens';

import { UserContext } from '../../contexts/UserContext';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import { useContext } from 'react';
import { useUser } from '../../hooks/useUser';
import { SignedInContext } from '../../contexts/SignedInContext';


const HodlProfileBadge = dynamic(
    () => import('../HodlProfileBadge').then(mod => mod.HodlProfileBadge),
    {
        ssr: true,
        loading: () => null
    }
);

const NewTokens = dynamic(
    () => import('../rankings/NewTokens').then(mod => mod.NewTokens),
    {
        ssr: true,
        loading: () => null
    }
);

const TopUsers = dynamic(
    () => import('../rankings/TopUsers').then(mod => mod.TopUsers),
    {
        ssr: true,
        loading: () => null
    }
);

const TopTokens = dynamic(
    () => import('../rankings/TopTokens').then(mod => mod.TopTokens),
    {
        ssr: true,
        loading: () => null
    }
);

const NewUsers = dynamic(
    () => import('../rankings/NewUsers').then(mod => mod.NewUsers),
    {
        ssr: true,
        loading: () => null
    }
);

export default function PrivateHomePageSidebar({ prefetchedUser }) {

    const { signedInAddress: address } = useContext(SignedInContext);
    const { data: user } = useUser(address, prefetchedUser);

    const limit = 8;

    const [hodlingCount] = useHodlingCount(user?.address);
    const [listedCount] = useListedCount(user?.address);

    const [followersCount] = useFollowersCount(user?.address);
    const [followingCount] = useFollowingCount(user?.address);

    const { rankings: mostLiked } = useRankings(true, limit, null, "token");
    const { rankings: mostFollowed } = useRankings(true, limit, null);

    const { results: newUsers } = useNewUsers(limit, null);
    const { results: newTokens } = useNewTokens(limit, null);

    return (
        <RankingsContext.Provider value={{
            limit,
            mostFollowed,
            mostLiked,
            newUsers,
            newTokens
        }}>
            <UserContext.Provider
                value={{
                    hodlingCount,
                    listedCount,
                    followersCount,
                    followingCount
                }}
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
                            md: 6
                        },
                        gap: 8,
                    }}
                >
                    <HodlProfileBadge user={user} />
                    <NewTokens showLikes={false} />
                    <TopTokens showLikes={false} />
                    <NewUsers followButton={false} />
                    <TopUsers followButton={true} />
                </Box>
            </UserContext.Provider>
        </RankingsContext.Provider>
    )
}
