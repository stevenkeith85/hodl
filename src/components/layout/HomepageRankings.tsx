import Box from '@mui/material/Box';
import { NewTokens } from '../rankings/NewTokens';
import { NewUsers } from '../rankings/NewUsers';
import { TopTokens } from '../rankings/TopTokens';
import { TopUsers } from '../rankings/TopUsers';

import { RankingsContext } from '../../contexts/RankingsContext';

import { useNewTokens } from '../../hooks/useNewTokens';
import { useNewUsers } from '../../hooks/useNewUsers';
import { useRankings } from '../../hooks/useRankings';


export const HomepageRankings = ({limit, prefetchedTopTokens, prefetchedTopUsers, prefetchedNewUsers, prefetchedNewTokens}) => {
    const { rankings: mostLiked } = useRankings(true, limit, prefetchedTopTokens, "token");
    const { rankings: mostFollowed } = useRankings(true, limit, prefetchedTopUsers);

    const { results: newUsers } = useNewUsers(limit, prefetchedNewUsers);
    const { results: newTokens } = useNewTokens(limit, prefetchedNewTokens);

    return (
        <RankingsContext.Provider value={{
            limit,
            mostFollowed,
            mostLiked,
            newUsers,
            newTokens
        }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: `1fr`,
                        sm: `1fr 1fr`,
                    },
                    gap: 8,
                    rowGap: 8,
                    marginY: 4,
                    textAlign: {
                        xs: 'center',
                        sm: 'left'
                    }
                }}
            >
                <TopUsers followButton={false} />
                <TopTokens showLikes={false} />
                <NewUsers followButton={false} />
                <NewTokens showLikes={false} />
            </Box>
        </RankingsContext.Provider>
    );
}
