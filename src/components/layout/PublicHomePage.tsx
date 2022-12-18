// import Box from "@mui/material/Box"
// import { HomePagePitch } from "./HomePagePitch"
// import { useRankings } from '../../hooks/useRankings';
// import { RankingsContext } from '../../contexts/RankingsContext';
// import { useNewUsers } from '../../hooks/useNewUsers';
// import { useNewTokens } from '../../hooks/useNewTokens';

// import dynamic from 'next/dynamic';

// import { RankingListLoading } from './RankingListLoading';
// import { HomepageQuickstart } from "./HomepageQuickstart";

// const NewTokens = dynamic(
//     () => import('../rankings/NewTokens').then(mod => mod.NewTokens),
//     {
//         ssr: false,
//         loading: () => <RankingListLoading text="New Polygon NFTs" />
//     }
// );

// const TopUsers = dynamic(
//     () => import('../rankings/TopUsers').then(mod => mod.TopUsers),
//     {
//         ssr: false,
//         loading: () => <RankingListLoading text="Top Polygon NFT Creators" />
//     }
// );

// const TopTokens = dynamic(
//     () => import('../rankings/TopTokens').then(mod => mod.TopTokens),
//     {
//         ssr: false,
//         loading: () => <RankingListLoading text="Top Polygon NFTs" />
//     }
// );

// const NewUsers = dynamic(
//     () => import('../rankings/NewUsers').then(mod => mod.NewUsers),
//     {
//         ssr: false,
//         loading: () => <RankingListLoading text="New Polygon NFT Creators" />
//     }
// );

// const PublicHomePage = ({ }) => {
//     const limit = 6;

//     const { rankings: mostLiked } = useRankings(true, limit, null, "token");
//     const { rankings: mostFollowed } = useRankings(true, limit, null);

//     const { results: newUsers } = useNewUsers(limit, null);
//     const { results: newTokens } = useNewTokens(limit, null);

//     return (
//         <RankingsContext.Provider value={{
//             limit,
//             mostFollowed,
//             mostLiked,
//             newUsers,
//             newTokens
//         }}>
//             <div
//                 style={{
//                     display: 'flex',
//                     flexDirection: 'column'
//                 }}
//             >
//                 <div style={{
//                     display: 'flex',
//                 }}>
//                     <HomePagePitch />
//                 </div>
//                 <Box
//                     sx={{
//                         display: 'grid',
//                         gridTemplateColumns: {
//                             xs: `1fr`,
//                             sm: `1fr 1fr`,
//                         },
//                         marginY: {
//                             xs: 2,
//                             sm: 4
//                         },
//                         marginX: {
//                             xs: 0,
//                             sm: 4
//                         },
//                         marginTop: {
//                             xs: 0,
//                             sm: 4
//                         },
//                         marginBottom: {
//                             sm: 6
//                         },
//                         gap: 6,
//                     }}
//                 >
//                     <TopUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
//                     <TopTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
//                     <NewUsers followButton={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
//                     <NewTokens showLikes={false} titleSize={16} size={54} fontSize={14} titleMargin={2} />
//                 </Box>
//                <HomepageQuickstart />
//             </div>
//         </RankingsContext.Provider>
//     )
// }

// export default PublicHomePage