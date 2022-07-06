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

import { fetchNFT } from "../api/nft/[tokenId]";
import { PriceHistory } from "../../components/nft/PriceHistory";
import { truncateText } from "../../lib/utils";
import { ProfileAvatar } from "../../components/ProfileAvatar";
import { Likes } from "../../components/Likes";
import Head from "next/head";
import { getPriceHistory } from "../api/token-bought/[tokenId]";
import { getTagsForToken } from "../api/tags";
import { HodlerPrivilege } from "../../components/nft/HodlerPrivilege";
import { HodlTagCloud } from "../../components/nft/HodlTagCloud";
import { getCommentsForToken } from "../api/comments";
import { HodlCommentsBox } from "../../components/nft/HodlCommentsBox";
import { Comments } from "../../components/Comments";
import { getCommentCount } from "../api/comments/count";
import { useState } from "react";
import { Forum, Info, Insights } from "@mui/icons-material";

import { useRouter } from "next/router";
import { getLikeCount } from "../api/like2/token/count";


export async function getServerSideProps({ params }) {
  try {
    const nft = await fetchNFT(params.tokenId);

    const comment = params.comment;
    const limit = 10;

    const prefetchedTags = await getTagsForToken(params.tokenId);

    const prefetchedComments = await getCommentsForToken(comment ? "comment" : "token", comment ? comment : params.tokenId, 0, limit);
    const prefetchedCommentCount = await getCommentCount(comment ? "comment" : "token", comment ? comment : params.tokenId);

    const priceHistory = await getPriceHistory(params.tokenId);

    const prefetchedLikeCount = await getLikeCount(params.tokenId);

    return {
      props: {
        nft,
        prefetchedTags,
        prefetchedComments: [prefetchedComments],
        limit,
        prefetchedCommentCount,
        priceHistory,
        prefetchedLikeCount
      },
    }
  } catch (e) {
    return { notFound: true }
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

  const { query } = useRouter();
  const comment = Array.isArray(query?.comment) ? query.comment[0] : query?.comment;

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
        <Grid item xs={12} md={5} marginBottom={2} paddingRight={{ md: 1 }}>
          <Stack spacing={2}>
            <DetailPageImage token={nft} />
            <Box gap={1} display='flex' alignItems='center'>
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
        <Grid item xs={12} md={7} marginBottom={2} paddingLeft={{ md: 1 }}>
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
              <HodlTagCloud
                nft={nft}
                prefetchedTags={prefetchedTags}
              />
              <HodlCommentsBox
                tokenId={nft.tokenId}
                object={comment ? "comment" : "token"}
                objectId={comment ? comment : nft.tokenId}
                prefetchedComments={prefetchedComments}
                prefetchedCommentCount={prefetchedCommentCount}
                limit={limit}
              />
            </Stack>
          </div>
          <div hidden={value !== 1}>
            <Stack spacing={2}>
              {Boolean(nft?.forSale) && <PriceCard nft={nft} />}
              <PriceHistory priceHistory={priceHistory} />
              <HodlerPrivilege nft={nft} />
              <IpfsCard nft={nft} />
              <NftActionButtons nft={nft} />
            </Stack>
          </div>
        </Grid>
      </Grid >
    </>
  )
}

export default NftDetail;

