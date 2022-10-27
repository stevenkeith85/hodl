import React from 'react';
import { useState } from "react";

import router from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";

import useSWR, { Fetcher } from "swr";

import DataObjectIcon from '@mui/icons-material/DataObject';
import InsightsIcon from '@mui/icons-material/Insights';
import ForumIcon from '@mui/icons-material/Forum';

import axios from "axios";

import { Likes } from "../../components/Likes";
import { Comments } from "../../components/comments/Comments";

import { authenticate } from "../../lib/jwt";

import { UserAvatarAndHandle } from "../../components/avatar/UserAvatarAndHandle";
import { NftContext } from "../../contexts/NftContext";
import { getToken } from "../api/token/[tokenId]";

import { MutableToken } from "../../models/Nft";
import { Token } from "../../models/Token";

import { HodlShareMenu } from "../../components/HodlShareMenu";
import { DetailPageAsset } from "../../components/nft/DetailPageAsset";
import { HodlLoadingSpinner } from "../../components/HodlLoadingSpinner";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const SocialTab = dynamic(
  () => import('../../components/nft/SocialTab'),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '150px' }}
    />
  }
);

const MarketTab = dynamic(
  () => import('../../components/nft/MarketTab'),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '150px' }}
    />
  }
);

const TokenDataTab = dynamic(
  () => import('../../components/nft/TokenDataTab'),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '150px' }}
    />
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
            <Box
              sx={{
                marginX: {
                  xs: 0
                }
              }}>
              <Stack
                spacing={1}
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Box
                  display="flex"
                  gap={1}
                  alignItems="center"
                >
                  <UserAvatarAndHandle
                    address={mutableToken?.hodler}
                    size={50}
                    fontSize={16}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    marginBottom: 2
                  }}>
                  <Tabs
                    value={value}
                    onChange={(e, v) => {
                      setValue(v);

                      router.push(
                        {
                          pathname: '/nft/[tokenId]',
                          query: {
                            tokenId: nft.id,
                            tab: v
                          }
                        },
                        undefined,
                        {
                          shallow: true
                        }
                      )
                    }}
                    textColor="secondary"
                    indicatorColor="secondary"
                  >
                    <Tab key={0} value={0} icon={
                      <ForumIcon
                        sx={{
                          fontSize: {
                            xs: 16,
                          }
                        }}
                      />
                    }
                      sx={{
                        minWidth: 0,
                        padding: 2,
                        margin: 0
                      }}
                    />
                    <Tab key={1} value={1} icon={
                      <InsightsIcon
                        sx={{
                          fontSize: {
                            xs: 16,
                          },
                        }}
                      />}
                      sx={{
                        minWidth: 0,
                        padding: 2,
                        margin: 0
                      }}
                    />
                    <Tab key={2} value={2}
                      icon={
                        <DataObjectIcon
                          sx={{
                            fontSize: {
                              xs: 16,
                            }
                          }}
                        />}
                      sx={{
                        minWidth: 0,
                        padding: 2,
                        margin: 0
                      }} />
                  </Tabs>
                </Box>
              </Stack>
            </Box>
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
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box gap={1.5} display='flex' alignItems='center'>
                    <Likes
                      sx={{
                        color: theme => theme.palette.secondary.main,
                        '.MuiTypography-body1': { color: '#666' }
                      }}
                      id={nft.id}
                      object="token"
                      fontSize={12}
                      size={20}
                    />
                    <Comments
                      fontSize={12}
                      size={20}
                      nft={nft}
                      popUp={false}
                      sx={{ color: '#333', paddingRight: 0 }}
                    />
                  </Box>
                  <HodlShareMenu nft={nft} />
                </Box>
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
