import Head from 'next/head';
import dynamic from 'next/dynamic';

import { authenticate } from '../lib/jwt';

import PrivateHomePageLoading from '../components/layout/PrivateHomePageLoading';
import { FeedContext } from '../contexts/FeedContext';
import { useActions2 } from '../hooks/useActions2';
import { ActionSet } from '../models/HodlAction';

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
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      address: req.address || null
    }
  }
}

export default function Feed({
  address,
}) {

  const homepage = "https://www.hodlmymoon.com";
  const title = "Hodl My Moon - Social Polygon NFT Platform - Make Frens. Mint, Buy, and Sell NFTs.";
  const description = "Join our social platform for Polygon NFT creators. Quickly, and easily mint NFTs. Connect with other NFT creators. Buy and Sell on the Marketplace.";
  const shareImage = "https://res.cloudinary.com/dyobirj7r/image/upload/ar_216:253,c_fill,w_1080/prod/nfts/bafkreihuew5ij6lvc2k7vjqr65hit7fljl7fsxlikrkndcdyp47xbi6pvy" // nft 36

  const feed = useActions2(address, ActionSet.Feed);
  
  return (
    <FeedContext.Provider value={{ feed }}>
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
      <PrivateHomePage />
      </FeedContext.Provider>
  )
}
