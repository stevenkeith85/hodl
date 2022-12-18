import Head from 'next/head';

import { authenticate } from '../lib/jwt';

import { getNewUsers } from './api/rankings/user/new';
import { getNewTokens } from './api/rankings/token/new';
import { getTopUsers } from './api/rankings/user';
import { getMostLikedTokens } from './api/rankings/token';

import { TopUsers } from '../components/rankings/TopUsers';
import { TopTokens } from '../components/rankings/TopTokens';
import { NewUsers } from '../components/rankings/NewUsers';
import { NewTokens } from '../components/rankings/NewTokens';

import Box from '@mui/material/Box';

import { HomepageQuickstart } from '../components/layout/HomepageQuickstart';
import { HomePagePitch } from '../components/layout/HomePagePitch'; // 36kb

import { RankingsContext } from '../contexts/RankingsContext';

import { useNewTokens } from '../hooks/useNewTokens';
import { useNewUsers } from '../hooks/useNewUsers';
import { useRankings } from '../hooks/useRankings';


export const getServerSideProps = async ({ req, res }) => {
  await authenticate(req, res);

  if (req?.address) {
    return {
      redirect: {
        destination: '/feed',
        permanent: false,
      }
    }
  }
  const limit = 10;

  const newUsersPromise = getNewUsers(0, limit, req?.address);
  const topUsersPromise = getTopUsers(0, limit, req?.address);
  const newTokensPromise = getNewTokens(0, limit);
  const topTokensPromise = getMostLikedTokens(0, limit);

  const [
    prefetchedNewUsers,
    prefetchedTopUsers,
    prefetchedNewTokens,
    prefetchedTopTokens
  ] = await Promise.all([newUsersPromise, topUsersPromise, newTokensPromise, topTokensPromise])

  return {
    props: {
      address: req.address || null,
      prefetchedNewUsers: [prefetchedNewUsers],
      prefetchedTopUsers: [prefetchedTopUsers],
      prefetchedNewTokens: [prefetchedNewTokens],
      prefetchedTopTokens: [prefetchedTopTokens],
      limit
    }
  }
}

export default function Home({
  address,
  prefetchedNewUsers,
  prefetchedTopUsers,
  prefetchedNewTokens,
  prefetchedTopTokens,
  limit
}) {
  const homepage = "https://www.hodlmymoon.com";
  const title = "Hodl My Moon - Social Polygon NFT Platform - Make Frens. Mint, Buy, and Sell NFTs.";
  const description = "Join our social platform for Polygon NFT creators. Quickly, and easily mint NFTs. Connect with other NFT creators. Buy and Sell on the Marketplace.";
  const shareImage = "https://res.cloudinary.com/dyobirj7r/image/upload/ar_216:253,c_fill,w_1080/prod/nfts/bafkreihuew5ij6lvc2k7vjqr65hit7fljl7fsxlikrkndcdyp47xbi6pvy" // nft 36

  const { rankings: mostLiked } = useRankings(true, limit, prefetchedTopTokens, "token");
  const { rankings: mostFollowed } = useRankings(true, limit, prefetchedTopUsers);

  const { results: newUsers } = useNewUsers(limit, prefetchedNewUsers);
  const { results: newTokens } = useNewTokens(limit, prefetchedNewTokens);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <link href={homepage} rel="canonical" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hodlmymoon" />
        <meta name="twitter:creator" content="@hodlmymoon" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={shareImage} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={homepage} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:description" content={description} />
      </Head>
      <RankingsContext.Provider value={{
        limit,
        mostFollowed,
        mostLiked,
        newUsers,
        newTokens
      }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <HomePagePitch />

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
            <TopTokens showLikes={false}  />
            <NewUsers followButton={false}  />
            <NewTokens showLikes={false}  />
          </Box>
          <HomepageQuickstart />
        </div>
      </RankingsContext.Provider>
    </>
  )
}
