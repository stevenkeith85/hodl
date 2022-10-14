import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography
} from "@mui/material";

import {
  DetailPageImage,
  IpfsCard,
  NftActionButtons
} from '../../components';

import React from 'react';
import { Likes } from "../../components/Likes";
import Head from "next/head";
import { AssetLicense } from "../../components/nft/AssetLicense";
import { HodlCommentsBox } from "../../components/comments/HodlCommentsBox";
import { Comments } from "../../components/comments/Comments";
import { useState } from "react";
import { DataObject, Forum, Insights } from "@mui/icons-material";
import router from "next/router";
import { MaticPrice } from "../../components/MaticPrice";
import { insertTagLinks } from "../../lib/templateUtils";
import { authenticate } from "../../lib/jwt";
import { UserAvatarAndHandle } from "../../components/avatar/UserAvatarAndHandle";
import { NftContext } from "../../contexts/NftContext";
import { HodlerCreatorCard } from "../../components/nft/HodlerCreatorCard";
import { getToken } from "../api/token/[tokenId]";
import useSWR, { Fetcher } from "swr";
import { Token } from "../../models/Token";
import axios from "axios";
import { HodlShareMenu } from "../../components/HodlShareMenu";
import { MutableToken } from "../../models/Nft";


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
                      <Forum
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
                      <Insights
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
                        <DataObject
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
                  // xs: 2,
                  sm: 0
                }
              }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  marginBottom: 2,
                }}
              >
                <DetailPageImage token={nft} />
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
                <Box
                  sx={{
                    background: 'white',
                    padding: {
                      xs: 2,
                      sm: 2
                    },
                    border: `1px solid #ddd`
                  }}>
                  <Box
                    marginBottom={2}
                    sx={{
                      position: 'relative',
                      paddingBottom: 2,
                      borderBottom: `1px solid #ddd`
                    }}
                  >
                    <Typography mb={1} sx={{ fontWeight: 600 }}>{nft.name}</Typography>
                    <Box sx={{ whiteSpace: 'pre-line' }}>{insertTagLinks(nft.description)}</Box>
                  </Box>
                  <HodlCommentsBox
                    limit={limit}
                    header={false}
                  />
                </Box>
              </div>
              <div hidden={value !== 1}>
                <Box display="grid" gap={4}>
                  <Box
                    display="grid"
                    sx={{
                      background: '#e8eaf6b0',
                      padding: 2,
                      border: `1px solid #ddd`,
                    }}>
                    <Typography variant="h2" marginBottom={2}>Price</Typography>
                    {
                      !mutableToken &&
                      <Skeleton variant="text" width={100} height={26} animation="wave" />
                    }
                    {
                      mutableToken && !mutableToken.forSale &&
                      <Typography sx={{ fontSize: 16 }}>Not for Sale</Typography>
                    }
                    {
                      mutableToken && mutableToken.forSale &&
                      <MaticPrice price={mutableToken?.price} color="black" size={18} fontSize={16} />}
                    {mutableToken && <Box
                      sx={{
                        marginTop: 2
                      }}>
                      <NftActionButtons
                        token={nft}
                        mutableToken={mutableToken}
                      />
                    </Box>}
                  </Box>
                  {/* TODO */}
                  {/* <PriceHistoryGraph nft={nft} /> */}
                </Box>
              </div>
              <div hidden={value !== 2}>
                <Box display="grid" gap={4}>
                  <IpfsCard token={nft} />
                  <HodlerCreatorCard creator={nft?.creator} hodler={mutableToken?.hodler} />
                  <AssetLicense nft={nft} />
                </Box>
              </div>
            </Box>
          </Grid>
        </Grid >
      </NftContext.Provider>
    </>
  )
}

export default NftDetail;
