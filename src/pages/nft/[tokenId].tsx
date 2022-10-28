import React from 'react';
import { useState } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";

import useSWR, { Fetcher } from "swr";

import axios from "axios";

import { authenticate } from "../../lib/jwt";
import { NftContext } from "../../contexts/NftContext";
import { getToken } from "../api/token/[tokenId]";
import { MutableToken } from "../../models/Nft";
import { Token } from "../../models/Token";
import { DetailPageAsset } from "../../components/nft/DetailPageAsset";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';


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
    loading: () => <Skeleton variant="rectangular" width="100%" height="20px" animation="wave" />
  }
);


const SocialTab = dynamic(
  () => import('../../components/nft/SocialTab'),
  {
    ssr: false,
    loading: () => <Skeleton variant="rectangular" width="100%" height="430px" animation="wave" />
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
  try {
    await authenticate(req, res);

    const limit = 10;
    const tab = Number(query.tab) || 0;

    const nft: Token = await getToken(params.tokenId);

    return {
      props: {
        address: req.address || null, // This is actually used to populate the address context in _app.ts. The app bar needs it
        nft,
        limit,
        tab
      },
    }
  } catch (e) {
    console.log("pages/nft/[tokenId] - error - ", e);
    return { notFound: true }
  }
}

const NftDetail = ({
  address,
  nft,
  limit,
  tab
}) => {
  const [value, setValue] = useState(Number(tab)); // tab
  const mutableTokenFetcher: Fetcher<MutableToken> = (url, id) => axios.get(`${url}/${id}`).then(r => r.data.mutableToken);
  const { data: mutableToken } = useSWR([`/api/contracts/mutable-token`, nft.id], mutableTokenFetcher);

  return (
    <>
      <NftContext.Provider
        value={{
          nft
        }}
      >
        <Head>
          <title>{nft.name} · Hodl My Moon</title>
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
            <div style={{ height: '50px' }}>
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
                  // lineHeight: 0,
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
                  <TokenActionBox nft={nft} />
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
                <SocialTab nft={nft} limit={limit} />
              </div>
              <div hidden={value !== 1}>
                <MarketTab mutableToken={mutableToken} nft={nft} />
              </div>
              <div hidden={value !== 2}>
                <TokenDataTab mutableToken={mutableToken} nft={nft} />
              </div>
            </Box>
          </Grid>
        </Grid >
      </NftContext.Provider>
    </>
  )
}

export default NftDetail;
