import {
  Box,
  Grid,
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

import { fetchNFT } from "../api/nft/[tokenId]";
import { Likes } from "../../components/Likes";
import Head from "next/head";
import { AssetLicense } from "../../components/nft/AssetLicense";
import { HodlCommentsBox } from "../../components/comments/HodlCommentsBox";
import { Comments } from "../../components/comments/Comments";
import { useState } from "react";
import { Forum, Insights } from "@mui/icons-material";

import router from "next/router";
import { MaticPrice } from "../../components/MaticPrice";
import { indigo } from "@mui/material/colors";
import { insertTagLinks } from "../../lib/templateUtils";
import { authenticate } from "../../lib/jwt";
import { FollowButton } from "../../components/profile/FollowButton";
import { UserAvatarAndHandle } from "../../components/avatar/UserAvatarAndHandle";
import { NftContext } from "../../contexts/NftContext";
import { HodlBorderedBox } from "../../components/HodlBorderedBox";
import { OwnerCreatorCard } from "../../components/nft/OwnerCreatorCard";


// Too slow to fetch the owner info server-side :(
// Perhaps if we start reading cached blockchain data; we could get away with it
export async function getServerSideProps({ params, query, req, res }) {
  try {
    await authenticate(req, res);

    const limit = 10;
    const tab = Number(query.tab) || 0;

    const nft = await fetchNFT(params.tokenId);
    if (!nft) {
      return { notFound: true }
    }

    // TODO: Fix; and do client-side
    // const ppriceHistory = getPriceHistory(params.tokenId);


    // const start = new Date();
    // const stop = new Date();
    // console.log('time taken', stop - start);

    return {
      props: {
        address: req.address || null,
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
          marginTop={4}
        >
          <Grid
            item
            xs={12}
            marginBottom={4}
          >
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
                  address={nft?.owner}
                  size={50}
                  fontSize={18}
                />
                <div>
                  <FollowButton profileAddress={nft?.owner} variant="text" />
                </div>
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
                  <Tab key={0} value={0} icon={<Forum fontSize="small" />} sx={{ padding: 1.5, minWidth: '60px' }} />
                  <Tab key={1} value={1} icon={<Insights fontSize="small" />} sx={{ padding: 1.5, minWidth: '60px' }} />
                </Tabs>
              </Box>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginBottom: 4,
              }}
            >
              <DetailPageImage token={nft} />
              <Box gap={1} display='flex' alignItems='center'>
                <Likes
                  sx={{
                    color: theme => theme.palette.secondary.main,
                    '.MuiTypography-body1': { color: '#666' }
                  }}
                  id={nft.id}
                  object="token"
                  fontSize={12}
                  size={18}
                />
                <Comments
                  fontSize={12}
                  size={18}
                  nft={nft}
                  popUp={false}
                  sx={{ color: '#333' }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            marginBottom={4}
            paddingLeft={{ md: 4 }}
          >
            <div hidden={value !== 0}>
              <HodlBorderedBox>
                <Box
                  paddingBottom={2}
                  mb={2}
                  sx={{ borderBottom: `1px solid #ddd` }}>
                  <Typography variant="h1" mb={3} sx={{ fontWeight: 600 }}>{nft.name}</Typography>
                  <Box sx={{ whiteSpace: 'pre-line' }}>{insertTagLinks(nft.description)}</Box>
                </Box>
                <HodlCommentsBox
                  limit={limit}
                  header={false}
                />
              </HodlBorderedBox>
            </div>
            <div hidden={value !== 1}>
              <Box display="grid" gap={2}>
                <Box display="grid" gap={3} sx={{
                  background: indigo[50],
                  padding: 2,
                  border: `1px solid #ddd`,
                  borderRadius: 1
                }}>
                  <Typography variant="h2">Price</Typography>
                  {nft?.forSale ?
                    <MaticPrice price={nft?.price} color="black" size={22} fontSize={22} /> :
                    <Typography sx={{ fontSize: '18px' }}>Not for Sale</Typography>}
                  <NftActionButtons nft={nft} />
                </Box>
                {/* <PriceHistoryGraph fallbackData={priceHistory} nft={nft} /> */}
                <OwnerCreatorCard token={nft} />
                <AssetLicense nft={nft} />
                <IpfsCard token={nft} />
              </Box>
            </div>
          </Grid>
        </Grid >
      </NftContext.Provider>
    </>
  )
}

export default NftDetail;

