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
import { PriceHistoryGraph } from "../../components/nft/PriceHistory";
import { Likes } from "../../components/Likes";
import Head from "next/head";
import { getPriceHistory } from "../api/token-bought/[tokenId]";
import { AssetLicense } from "../../components/nft/AssetLicense";
import { getCommentsForToken } from "../api/comments";
import { HodlCommentsBox } from "../../components/comments/HodlCommentsBox";
import { Comments } from "../../components/comments/Comments";
import { getCommentCount } from "../api/comments/count";
import { useState } from "react";
import { Forum, Insights } from "@mui/icons-material";

import router from "next/router";
import { getLikeCount } from "../api/like/token/count";
import { MaticPrice } from "../../components/MaticPrice";
import { indigo } from "@mui/material/colors";
import { insertTagLinks } from "../../lib/templateUtils";
import { authenticate } from "../../lib/jwt";
import { FollowButton } from "../../components/profile/FollowButton";
import { UserAvatarAndHandle } from "../../components/avatar/UserAvatarAndHandle";
import { getUser } from "../api/user/[handle]";
import { NftContext } from "../../contexts/NftContext";
import { HodlBorderedBox } from "../../components/HodlBorderedBox";


export async function getServerSideProps({ params, query, req, res }) {
  try {
    await authenticate(req, res);

    const nft = await fetchNFT(params.tokenId);

    if (!nft) {
      return { notFound: true }
    }

    // To populate their avatar
    const owner = await getUser(nft.owner, req.address);

    const comment = params.comment;
    const limit = 10;
    const tab = Number(query.tab) || 0;

    const pprefetchedCommentCount = getCommentCount(comment ? "comment" : "token", comment ? comment : params.tokenId);
    const pprefetchedLikeCount = getLikeCount(params.tokenId);

    // TODO: We might not prefetch these?; to speed up the initial load
    const pprefetchedComments = getCommentsForToken(comment ? "comment" : "token", comment ? comment : params.tokenId, 0, limit, !comment);
    const ppriceHistory = getPriceHistory(params.tokenId);

    const [
      prefetchedComments,
      prefetchedCommentCount,
      priceHistory,
      prefetchedLikeCount] = await Promise.all([
        pprefetchedComments,
        pprefetchedCommentCount,
        ppriceHistory,
        pprefetchedLikeCount]);

    return {
      props: {
        address: req.address || null,
        nft,
        owner,
        limit,
        prefetchedComments: null,//[prefetchedComments],
        prefetchedCommentCount,
        priceHistory,
        prefetchedLikeCount,
        tab
      },
    }
  } catch (e) {
    return { notFound: true }
  }
}

const NftDetail = ({
  address,
  nft,
  owner,
  prefetchedComments,
  limit,
  prefetchedCommentCount,
  priceHistory,
  prefetchedLikeCount,
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
        <Grid container>
          <Grid item xs={12} marginY={4}>
            <Stack
              spacing={1}
              direction="row"
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <Box display="flex" gap={1} alignItems="center">
                <UserAvatarAndHandle
                  address={owner.address}
                  fallbackData={owner}
                  size={50}
                  fontSize={'18px'}
                />
                <div>
                  <FollowButton profileAddress={nft?.owner} variant="text" />
                </div>
              </Box>

              <Box display="flex" justifyContent="start" sx={{
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
          <Grid item xs={12} md={5} marginBottom={2} paddingRight={{ md: 1 }}>
            <Stack spacing={2}>
              <DetailPageImage token={nft} />
              <Box gap={1.5} display='flex' alignItems='center'>
                <Likes
                  sx={{
                    color: theme => theme.palette.secondary.main,
                    '.MuiTypography-body1': { color: '#666' }
                  }}
                  id={nft.id}
                  object="token"
                  prefetchedLikeCount={prefetchedLikeCount}
                  size={22}
                />
                <Comments
                  size={22}
                  nft={nft}
                  popUp={false}
                  sx={{ color: '#333' }}
                  fallbackData={prefetchedCommentCount}
                />
              </Box>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            marginBottom={2}
            paddingLeft={{ md: 1 }}
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
                <HodlCommentsBox limit={limit} header={false} fallbackData={prefetchedComments} />
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
                  <MaticPrice price={nft?.price} color="black" size={22} fontSize={22}/> : 
                  <Typography sx={{ fontSize: '18px'}}>Not for Sale</Typography>}
                  <NftActionButtons nft={nft} />
                </Box>
                <PriceHistoryGraph fallbackData={priceHistory} nft={nft} />
                <AssetLicense nft={nft} />
                <IpfsCard nft={nft} />
              </Box>
            </div>
          </Grid>
        </Grid >
      </NftContext.Provider>
    </>
  )
}

export default NftDetail;

