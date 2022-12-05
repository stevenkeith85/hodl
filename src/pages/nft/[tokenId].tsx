import React from 'react';
import { useState } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";

import useSWR, { Fetcher } from "swr";

import { authenticate } from "../../lib/jwt";
import { NftContext } from "../../contexts/NftContext";

import { MutableToken } from "../../models/MutableToken";
import { DetailPageAsset } from "../../components/nft/DetailPageAsset";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import TokenActionBoxLoading from '../../components/nft/TokenActionBoxLoading';
import SocialTabLoading from '../../components/nft/SocialTabLoading';
import { makeCloudinaryUrl } from '../../lib/cloudinaryUrl';


const TokenHeader = dynamic(
  () => import('../../components/nft/TokenHeader'),
  {
    ssr: false,
    loading: () => null
  }
);


const TokenActionBox = dynamic(
  () => import('../../components/nft/TokenActionBox'),
  {
    ssr: false,
    loading: () => <TokenActionBoxLoading />
  }
);


const SocialTab = dynamic(
  () => import('../../components/nft/SocialTab'),
  {
    ssr: false,
    loading: () => <SocialTabLoading />
  }
);


const MarketTab = dynamic(
  () => import('../../components/nft/MarketTab'),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" width="100%" height="158px" animation="wave" />
  }
);


const TokenDataTab = dynamic(
  () => import('../../components/nft/TokenDataTab'),
  {
    ssr: false,
    loading: () => <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Skeleton variant="rectangular" width="100%" height="127.18px" animation="wave" />
      <Skeleton variant="rectangular" width="100%" height="169.19px" animation="wave" />
      <Skeleton variant="rectangular" width="100%" height="180.17px" animation="wave" />
    </Box>
  }
);


export async function getServerSideProps({ params, query, req, res }) {
  await authenticate(req, res);

  const limit = 10;
  const tab = Number(query.tab) || 0;

  // Call via the API (rather than just hit the database) as we heavily cache this data at the edge; so it should be faster and reduce our costs
  const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://hodlmymoon`;
  const nft = await fetch(`${host}/api/token/${params.tokenId}`).then(r => r.json()).then(data => data.token);


  return {
    props: {
      address: req.address || null, // This is actually used to populate the address context in _app.ts. The app bar needs it
      tokenId: params.tokenId,
      limit,
      tab,
      nft
    },
  }
}

const NftDetail = ({
  address,
  tokenId,
  limit,
  tab,
  nft
}) => {
  const [value, setValue] = useState(Number(tab)); // tab

  const mutableTokenFetcher: Fetcher<MutableToken> = (url, id) => fetch(`${url}/${id}`).then(r => r.json()).then(data => data.mutableToken);
  const { data: mutableToken } = useSWR(tokenId ? [`/api/contracts/mutable-token`, tokenId] : null, mutableTokenFetcher);

  const getImage = (nft) => makeCloudinaryUrl("image", "nfts", nft?.image, { crop: 'fill', aspect_ratio: nft?.properties?.aspectRatio, width: '1080' });

  return (
    <>
      <NftContext.Provider
        value={{
          nft,
          mutableToken
        }}
      >
        <Head>
          <title>{`${nft?.name || ''} | NFT | Hodl My Moon`}</title>

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@hodlmymoon" />
          <meta name="twitter:creator" content="@hodlmymoon" />
          <meta name="twitter:title" content={`${nft?.name || ''} | NFT | Hodl My Moon`} />
          <meta name="twitter:description" content={nft?.description} />
          <meta name="twitter:image" content={getImage(nft)} />

          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://www.hodlmymoon.com/nft/${nft?.id}`} />
          <meta property="og:title" content={`${nft?.name || ''} | NFT | Hodl My Moon`} />
          <meta property="og:image" content={getImage(nft)} />
          <meta property="og:description" content={nft?.description} />

        </Head>
        <Grid
          container
          sx={{
            marginTop: {
              xs: 2,
              sm: 4
            }
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              marginBottom: {
                xs: 2,
                sm:
                  4
              }
            }}
          >
            <div
              style={{ height: '50px' }}
            >
              {nft && <TokenHeader mutableToken={mutableToken} nft={nft} setValue={setValue} value={value} />}
            </div>

          </Grid>
          <Grid
            item
            xs={12}
            md={5}
          >
            <Box
              sx={{
                marginX: {
                  sm: 0
                }
              }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: {
                    xs: 2,
                  },
                  marginBottom: {
                    xs: 2,
                    sm: 4
                  }
                }}
              >
                {nft && <>
                  <DetailPageAsset token={nft} />
                  <div style={{ height: '20px' }}>
                    <TokenActionBox nft={nft} />
                  </div>
                </>}
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            marginBottom={{ xs: 2, sm: 4 }}
            paddingLeft={{ md: 4 }}
          >
            <Box
              sx={{
                marginX: {
                  sm: 0
                }
              }}>
              <div hidden={value !== 0}>
                {nft && <SocialTab nft={nft} limit={limit} />}
              </div>
              <div hidden={value !== 1}>
                {nft && <MarketTab mutableToken={mutableToken} nft={nft} />}
              </div>
              <div hidden={value !== 2}>
                {nft && <TokenDataTab mutableToken={mutableToken} nft={nft} />}
              </div>
            </Box>
          </Grid>
        </Grid >
      </NftContext.Provider>
    </>
  )
}

export default NftDetail;
