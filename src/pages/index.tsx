import Head from 'next/head';
import dynamic from 'next/dynamic';

import { authenticate } from '../lib/jwt';
import { getUserUsingHandle } from './api/user/[handle]';

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

  if (!req.address) {
    return {
      props: {
        address: null,
        user: null,
      }
    }
  }

  // TODO: We should just get the user on the private homepage
  const user = await getUserUsingHandle(req.address, req.address);

  return {
    props: {
      address: req.address || null,
      user,
    }
  }
}

export default function Home({
  address,
  user,
}) {
  return (
    <>
      <Head>
        <title>Hodl My Moon</title>
      </Head>
        {!address && <PublicHomePage /> }
        {address && <PrivateHomePage user={user} address={address} />}      
    </>
  )
}
