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
import TokenHeaderLoading from '../../components/nft/TokenHeaderLoading';

import { makeCloudinaryUrl } from '../../lib/cloudinaryUrl';

import { getTokenVM } from '../../lib/database/rest/getTokenVM';


const TokenHeader = dynamic(
  () => import('../../components/nft/TokenHeader'),
  {
    ssr: false,
    loading: () => <TokenHeaderLoading mutableToken={undefined} value={undefined} setValue={undefined} nft={undefined} />
  }
);


const TokenActionBox = dynamic(
  () => import('../../components/nft/TokenActionBox'),
  {
    ssr: false,
    loading: () => <TokenActionBoxLoading />
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

  // const start = Date.now();

  const nft = await getTokenVM(params.tokenId);
  // const stop = Date.now();
  // console.log('time taken', stop - start);

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
  nft,
}) => {
  const SocialTab = dynamic(
    () => import('../../components/nft/SocialTab'),
    {
      ssr: false,
      loading: () => <SocialTabLoading nft={nft} />
    }
  );

  const [value, setValue] = useState(Number(tab)); // tab

  // TODO: Extract hook
  const mutableTokenFetcher: Fetcher<MutableToken> = (url, id) => fetch(`${url}/${id}`).then(r => r.json()).then(data => data.mutableToken);
  const { data: mutableToken } = useSWR(
    tokenId ? [`/api/contracts/mutable-token`, tokenId] : null,
    mutableTokenFetcher,
    {
      dedupingInterval: 15000,
      focusThrottleInterval: 15000,
    }
  );

  const getImage = (nft) => makeCloudinaryUrl("image", "nfts", nft?.image, { crop: 'fill', aspect_ratio: nft?.properties?.aspectRatio, width: '1080' });

  const title = `${nft?.name || ''} - Polygon Matic NFT `;
  const description = nft?.description || 'An NFT minted on the polygon blockchain';
  const canonical = `https://www.hodlmymoon.com/nft/${nft.id}`;

  return (
    <>
      <NftContext.Provider
        value={{
          nft,
          mutableToken
        }}
      >
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={canonical} />

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
              <TokenHeader mutableToken={mutableToken} nft={nft} setValue={setValue} value={value} />
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
                <DetailPageAsset token={nft} />
                <div style={{ height: '20px' }}>
                  <TokenActionBox nft={nft} prefetchedCommentCount={nft?.commentCount} prefetchedLikeCount={nft?.likeCount} />
                </div>
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
                {value === 0 && <SocialTab nft={nft} limit={limit} />}
              </div>
              <div hidden={value !== 1}>
                {value === 1 && <MarketTab mutableToken={mutableToken} nft={nft} />}
              </div>
              <div hidden={value !== 2}>
                {value === 2 && <TokenDataTab mutableToken={mutableToken} nft={nft} />}
              </div>
            </Box>
          </Grid>
        </Grid >
      </NftContext.Provider>
    </>
  )
}

export default NftDetail;
