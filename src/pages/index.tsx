import Head from 'next/head';
import dynamic from 'next/dynamic';

import { authenticate } from '../lib/jwt';
import { useRankings } from '../hooks/useRankings';
import { RankingsContext } from '../contexts/RankingsContext';
import { getUser } from './api/user/[handle]';
import { useNewUsers } from '../hooks/useNewUsers';
import { useNewTokens } from '../hooks/useNewTokens';

import PublicHomePageLoading from '../components/layout/PublicHomeLoading';
import PrivateHomePageLoading from '../components/layout/PrivateHomePageLoading';


const PublicHomePage = dynamic(
  () => import('../components/layout/PublicHomePage'),
  {
    ssr: false,
    loading: () => <PublicHomePageLoading />
  }
);


const PrivateHomePage = dynamic(
  () => import('../components/layout/PrivateHomePage'),
  {
    ssr: false,
    loading: () => <PrivateHomePageLoading />
  }
);


export const getServerSideProps = async ({ req, res }) => {
  await authenticate(req, res);

  const limit = 10;

  if (!req.address) {
    return {
      props: {
        address: null,
        user: null,
        limit
      }
    }
  }

  // TODO: We should just get the user on the private homepage
  const user = await getUser(req.address, req.address);

  return {
    props: {
      address: req.address || null,
      user,
      limit,
    }
  }
}

export default function Home({
  address,
  user,
  limit,
}) {

  // const { rankings: mostLiked } = useRankings(true, limit, null, "token");
  // const { rankings: mostFollowed } = useRankings(true, limit, null);

  // const { results: newUsers } = useNewUsers(limit, null);
  // const { results: newTokens } = useNewTokens(limit, null);

  return (
    <>
      <Head>
        <title>Hodl My Moon</title>
      </Head>

      {/* <RankingsContext.Provider value={{
        limit,
        mostFollowed,
        mostLiked,
        newUsers,
        newTokens
      }}> */}
        {!address && <PublicHomePage /> }
        {address && <PrivateHomePage user={user} address={address} />}
      {/* </RankingsContext.Provider> */}
    </>
  )
}
