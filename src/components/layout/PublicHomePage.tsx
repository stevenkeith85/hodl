import { HomePagePitch } from "./HomePagePitch"

import dynamic from 'next/dynamic';

import { RankingListLoading } from './RankingListLoading';

const NewTokens = dynamic(
    () => import('../rankings/NewTokens').then(mod => mod.NewTokens),
    {
        ssr: false,
        loading: () => <RankingListLoading text="New Tokens" />
    }
);

const TopUsers = dynamic(
    () => import('../rankings/TopUsers').then(mod => mod.TopUsers),
    {
        ssr: false,
        loading: () => <RankingListLoading text="Top Users" />
    }
);

const TopTokens = dynamic(
    () => import('../rankings/TopTokens').then(mod => mod.TopTokens),
    {
        ssr: false,
        loading: () => <RankingListLoading text="Top Tokens" />
    }
);

const NewUsers = dynamic(
    () => import('../rankings/NewUsers').then(mod => mod.NewUsers),
    {
        ssr: false,
        loading: () => <RankingListLoading text="New Users" />
    }
);


import Box from "@mui/material/Box"

const PublicHomePage = ({ }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{
                display: 'flex',
            }}>
                <HomePagePitch />
            </div>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: `1fr`,
                        sm: `1fr 1fr`,
                    },
                    marginY: {
                        xs: 2,
                        sm: 4
                    },
                    marginX: {
                        xs: 0,
                        sm: 4
                    },
                    marginTop: {
                        xs: 0,
                        sm: 4
                    },
                    marginBottom: {
                        sm: 6
                    },
                    gap: 6,
                }}
            >
                <TopUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <TopTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <NewUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
                <NewTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
            </Box>
        </div>
    )
}

export default PublicHomePage