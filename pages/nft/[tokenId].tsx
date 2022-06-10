import {
  Box,
  Grid,
  NoSsr,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from "@mui/material";

import {
  DetailPageImage,
  IpfsCard,
  PriceCard,
  DescriptionCard,
  NftActionButtons
} from '../../components';

import { fetchNFT } from "../../lib/server/nft";
import { PriceHistory } from "../../components/nft/PriceHistory";
import { truncateText } from "../../lib/utils";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { Likes } from "../../components/Likes";
import Head from "next/head";
import { getPriceHistory } from "../api/token-bought/[tokenId]";
import { getTagsForToken } from "../api/tags";
import { HodlerPrivilege } from "../../components/nft/HodlerPrivilege";
import { HodlTagCloud } from "../../components/nft/HodlTagCloud";
import { getCommentsForToken } from "../api/comments/token";
import { HodlCommentsBox } from "../../components/nft/HodlCommentsBox";
import { Comments } from "../../components/Comments";
import { getCommentCount } from "../api/comments/token/count";
import { useState } from "react";
import { Forum, Info, Insights } from "@mui/icons-material";
import { getLikeCount } from "../api/like/likeCount";


export async function getServerSideProps({ params }) {
  const nft = await fetchNFT(params.tokenId);
  const limit = 6;

  if (!nft) {
    return { notFound: true }
  }

  const prefetchedTags = await getTagsForToken(params.tokenId);

  const prefetchedComments = await getCommentsForToken(params.tokenId, 0, limit);
  const prefetchedCommentCount = await getCommentCount(params.tokenId);
  
  const priceHistory = await getPriceHistory(params.tokenId);

  const prefetchedLikeCount = await getLikeCount(params.tokenId);

  return {
    props: {
      nft,
      prefetchedTags,
      prefetchedComments: null,//[prefetchedComments],
      limit,
      prefetchedCommentCount,
      priceHistory,
      prefetchedLikeCount
    },
  }
}

const NftDetail = ({ 
  nft, 
  prefetchedTags, 
  prefetchedComments, 
  limit, 
  prefetchedCommentCount, 
  priceHistory, 
  prefetchedLikeCount 
}) => {
  const [value, setValue] = useState(0);

  return (
    <>
      <Head>
        <title>{nft.name} | HodlMyMoon</title>
      </Head>
      <Grid container>
        <Grid item xs={12} marginY={2}>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <Tooltip title={nft.name}>
              <Typography variant="h1">{truncateText(nft?.name, 100)}</Typography>
            </Tooltip>
            <ProfileAvatar reverse={true} profileAddress={nft?.owner} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} marginBottom={2} paddingRight={{ md: 1 }}>
          <Stack spacing={2}>
            <DetailPageImage token={nft} />
            <Box gap={2} display='flex' alignItems='center'>
              <Likes 
                sx={{ color: theme => theme.palette.secondary.main, '.MuiTypography-body1': { color: '#666' } }} 
                id={nft.tokenId} 
                token={true} 
                prefetchedLikeCount={prefetchedLikeCount}
                />
              <Comments 
                nft={nft} 
                popUp={false} 
                prefetchedCommentCount={prefetchedCommentCount}
                sx={{ color: '#333' }} 
              />
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} marginBottom={2} paddingLeft={{ md: 1 }}>
          <Box display="flex" justifyContent="start" sx={{
            marginBottom: 2
          }}>
            <Tabs
              value={value}
              onChange={(e, v) => {
                setValue(v);
              }}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab key={0} value={0} icon={<Forum />} />
              <Tab key={1} value={1} icon={<Insights />} />
            </Tabs>
          </Box>
          <div hidden={value !== 0}>
            <Stack spacing={2}>
              <DescriptionCard nft={nft} />
              <HodlCommentsBox 
                nft={nft} 
                prefetchedComments={prefetchedComments} 
                prefetchedCommentCount={prefetchedCommentCount} 
                limit={limit} 
              />
              <HodlTagCloud 
                nft={nft} 
                prefetchedTags={prefetchedTags} 
              />
            </Stack>
          </div>
          <div hidden={value !== 1}>
            <Stack spacing={2}>
              {Boolean(nft?.forSale) && <PriceCard nft={nft} />}
              <HodlerPrivilege nft={nft} />
              <IpfsCard nft={nft} />
              {Boolean(priceHistory.length) && <PriceHistory priceHistory={priceHistory} />}
              <NftActionButtons nft={nft} />
            </Stack>
          </div>
        </Grid>
      </Grid >
    </>
  )
}

export default NftDetail;

