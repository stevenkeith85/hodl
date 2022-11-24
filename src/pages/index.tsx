import Head from 'next/head';
import dynamic from 'next/dynamic';

import { authenticate } from '../lib/jwt';

import PublicHomePageLoading from '../components/layout/PublicHomeLoading';
import PrivateHomePageLoading from '../components/layout/PrivateHomePageLoading';
import { getUser } from '../lib/database/rest/getUser';


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

  const user = await getUser(req.address, req.address);

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
        <title>Hodl My Moon, an NFT Social Network and NFT Marketplace</title>

        <meta content="Hodl My Moon, an NFT Social Network and NFT marketplace" property="og:title"/>
        <meta content="website" property="og:type"/>
        <meta content="https://www.hodlmymoon.com/" property="og:url"/>
        <meta content="en_US" property="og:locale"/>
        <meta content="Hodl My Moon" property="og:site_name"/>

        <meta content="Hodl My Moon is an NFT Social Network and NFT marketplace. Mint free Polygon NFTs as social media posts. Follow digital artists, photographers and other crypto enthusiasts. Like or Comment on their latest NFTs. Sell your NFTs on the marketplace" property="og:description"/>
        <meta content="Hodl My Moon is an NFT Social Network and NFT marketplace. Mint free Polygon NFTs as social media posts. Follow digital artists, photographers and other crypto enthusiasts. Like or Comment on their latest NFTs. Sell your NFTs on the marketplace" name="description"/>

        <link href="https://www.hodlmymoon.com" rel="canonical"/>
      </Head>
        {!address && <PublicHomePage /> }
        {address && <PrivateHomePage user={user} address={address} />}      
    </>
  )
}
