
import Box from "@mui/material/Box"
import { RankingListLoading } from "./RankingListLoading"
import { HomePagePitchLoading } from "./HomePagePitchLoading"
import { HomepageQuickstart } from "./HomepageQuickstart"


const PublicHomePageLoading = ({ }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>

            <div style={{
                display: 'flex',
            }}>
                <HomePagePitchLoading />
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
                    gap: 4,
                }}
            >
                <RankingListLoading text="Top NFT Creators" />
                <RankingListLoading text="Top Polygon NFTs" />
                <RankingListLoading text="New NFT Creators" />
                <RankingListLoading text="New Polygon NFTs" />
            </Box>
            <HomepageQuickstart />
        </Box >
    )
}

export default PublicHomePageLoading