import { RankingListLoading } from './RankingListLoading';
import HodlProfileBadgeLoading from './HodlProfileBadgeLoading';
import Box from '@mui/material/Box';


export default function PrivateHomePageSidebarLoading() {
    return (
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
            <HodlProfileBadgeLoading />
            <RankingListLoading text="Top Users" />
            <RankingListLoading text="Top Tokens" />
            <RankingListLoading text="New Users" />
            <RankingListLoading text="New Tokens" />
        </Box>
    )
}