import Head from 'next/head';
import dynamic from 'next/dynamic';

import { authenticate } from '../lib/jwt';

import PublicHomePageLoading from '../components/layout/PublicHomeLoading';
import PrivateHomePageLoading from '../components/layout/PrivateHomePageLoading';
import { getUser } from '../lib/database/rest/getUser';
import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';


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

  const homepage = "https://www.hodlmymoon.com";
  const title = "Polygon NFT Marketplace and Social Network";
  const description = "Discover our NFT Marketplace and Social Network. Mint free Polygon NFTs as social media posts. Follow other NFT enthusiasts, or sell your digital art on the marketplace.";
  const shareImage = "https://res.cloudinary.com/dyobirj7r/image/upload/ar_216:253,c_fill,w_1080/prod/nfts/bafkreihuew5ij6lvc2k7vjqr65hit7fljl7fsxlikrkndcdyp47xbi6pvy" // nft 36

  const { address: walletAddress } = useContext(WalletContext);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}/>
        
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

      {!walletAddress && <PublicHomePage />}
      {walletAddress && <PrivateHomePage user={user} address={walletAddress} />}
    </>
  )
}
