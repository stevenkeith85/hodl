import { RankingListLoading } from './RankingListLoading';
import HodlProfileBadgeLoading from './HodlProfileBadgeLoading';
import Box from '@mui/material/Box';


export default function PrivateHomePageSidebarLoading({display}) {
    return (
        <Box
            display={display ? 'flex': 'none'}
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
            <HodlProfileBadgeLoading />
            <RankingListLoading text="New Polygon NFTs" />
            <RankingListLoading text="Top Polygon NFTs" />
            <RankingListLoading text="New Polygon NFT Creators" />
            <RankingListLoading text="Top Polygon NFT Creators" />
        </Box>
    )
}