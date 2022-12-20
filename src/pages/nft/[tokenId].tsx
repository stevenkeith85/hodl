import React from 'react';
import { useState } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";

import { authenticate } from "../../lib/jwt";

import { DetailPageAsset } from "../../components/nft/DetailPageAsset";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { makeCloudinaryUrl } from '../../lib/cloudinaryUrl';

import { getTokenVM } from '../../lib/database/rest/getTokenVM';
import { getMutableToken } from '../api/contracts/mutable-token/[tokenId]';
import { getUser } from '../../lib/database/rest/getUser';


const TokenHeader = dynamic(
  () => import('../../components/nft/TokenHeader'),
  {
    ssr: true,
    loading: () => null
  }
);

const TokenActionBox = dynamic(
  () => import('../../components/nft/TokenActionBox'),
  {
    ssr: true,
    loading: () => null
  }
);

const SocialTab = dynamic(
  () => import('../../components/nft/SocialTab'),
  {
    ssr: true,
    loading: () => null
  }
);

const MarketTab = dynamic(
  () => import('../../components/nft/MarketTab'),
  {
    ssr: true,
    loading: () => null
  }
);


const TokenDataTab = dynamic(
  () => import('../../components/nft/TokenDataTab'),
  {
    ssr: true,
    loading: () => null
  }
);


export async function getServerSideProps({ params, query, req, res }) {
  await authenticate(req, res);

  const limit = 10;
  const tab = Number(query.tab) || 0;

  // const start = Date.now();

  const prefetchedTokenPromise = getTokenVM(params.tokenId);
  const prefetchedMutableTokenPromise = getMutableToken(params.tokenId, req);
  const [prefetchedToken, prefetchedMutableToken] = await Promise.all([prefetchedTokenPromise, prefetchedMutableTokenPromise])

  const prefetchedHodler = await getUser(prefetchedMutableToken?.hodler);
  // const stop = Date.now();
  // console.log('time taken', stop - start);

  return {
    props: {
      address: req.address || null, // This is actually used to populate the address context in _app.ts. The app bar needs it
      limit,
      tab,
      prefetchedToken,
      prefetchedMutableToken,
      prefetchedHodler
    },
  }
}

const NftDetail = ({
  address,
  limit,
  tab,
  prefetchedToken,
  prefetchedMutableToken,
  prefetchedHodler
}) => {
  const [value, setValue] = useState(Number(tab)); // tab

  const getImage = (nft) => makeCloudinaryUrl("image", "nfts", nft?.image, { crop: 'fill', aspect_ratio: nft?.properties?.aspectRatio, width: '1080' });

  const title = `${prefetchedToken?.name || ''} - Polygon Matic NFT `;
  const description = prefetchedToken?.description || 'An NFT minted on the polygon blockchain';
  const canonical = `https://www.hodlmymoon.com/nft/${prefetchedToken.id}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hodlmymoon" />
        <meta name="twitter:creator" content="@hodlmymoon" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={getImage(prefetchedToken)} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={getImage(prefetchedToken)} />
        <meta property="og:description" content={description} />
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
              sm: 4
            }
          }}
        >
          <div>
            <TokenHeader
              prefetchedMutableToken={prefetchedMutableToken}
              prefetchedToken={prefetchedToken}
              prefetchedHodler={prefetchedHodler}
              setValue={setValue}
              value={value}
            />
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
              <DetailPageAsset
                token={prefetchedToken}
              />
              <Box
              sx={{
                marginY: 0
              }}>
                <TokenActionBox
                  nft={prefetchedToken}
                  prefetchedCommentCount={prefetchedToken?.commentCount}
                  prefetchedLikeCount={prefetchedToken?.likeCount}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={7}
          marginBottom={{ xs: 2, sm: 4 }}
          paddingLeft={{ md: 8 }}
        >
          <Box
            sx={{
              marginX: {
                sm: 0
              }
            }}>
            <div hidden={value !== 0}>
              {
                <SocialTab
                  prefetchedToken={prefetchedToken}
                  limit={limit}
                />}
            </div>
            <div hidden={value !== 1}>
              <MarketTab
                prefetchedMutableToken={prefetchedMutableToken}
                prefetchedToken={prefetchedToken}
              />
            </div>
            <div hidden={value !== 2}>
              <TokenDataTab
                prefetchedMutableToken={prefetchedMutableToken}
                prefetchedToken={prefetchedToken}
              />
            </div>
          </Box>
        </Grid>
      </Grid >
    </>
  )
}

export default NftDetail;
