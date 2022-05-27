import {
  Grid,
  NoSsr,
  Stack,
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
import { getTagsForToken } from "../api/tags/[token]";
import { HodlerPrivilege } from "../../components/nft/HodlerPrivilege";
import { HodlTagCloud } from "../../components/nft/HodlTagCloud";
import { getCommentsForToken } from "../api/comments/[token]";
import { HodlCommentsBox } from "../../components/nft/HodlCommentsBox";
import { Comments } from "../../components/Comments";
import { getCommentCount } from "../api/comments/count";


export async function getServerSideProps({ params }) {
  const nft = await fetchNFT(params.tokenId);

  if (!nft) {
      return { notFound: true }
  }

  const prefetchedTags = await getTagsForToken(params.tokenId);

  // TODO: What if there are 1000's of comments?
  const prefetchedComments = await getCommentsForToken(params.tokenId);
  const prefetchedCommentCount = await getCommentCount(params.tokenId);
  const priceHistory = await getPriceHistory(params.tokenId);

  return {
    props: {
      nft,
      prefetchedTags,
      prefetchedComments,
      prefetchedCommentCount,
      priceHistory
    },
  }
}

const NftDetail = ({ nft, prefetchedTags, prefetchedComments, prefetchedCommentCount, priceHistory }) => {
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
            <Stack spacing={1} direction="row" sx={{ display: 'flex', alignContent: 'center'}}>
              <Likes sx={{ color: theme => theme.palette.secondary.main, '.MuiTypography-body1': { color: '#666' } }} tokenId={nft.tokenId} />
              <Comments nft={nft} popUp={false} sx={{ color: '#333'}}/>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} marginBottom={2} paddingLeft={{ md: 1 }}>
          <Stack spacing={2}>
            <DescriptionCard nft={nft} />
            <HodlerPrivilege nft={nft} />
            <HodlTagCloud nft={nft} prefetchedTags={prefetchedTags} />
            <HodlCommentsBox nft={nft} prefetchedComments={prefetchedComments} prefetchedCommentCount={prefetchedCommentCount}/>
            <IpfsCard nft={nft} />
            {Boolean(nft?.forSale) && <PriceCard nft={nft} />}
            {Boolean(priceHistory.length) && <PriceHistory priceHistory={priceHistory} />}
            <NftActionButtons nft={nft} />
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default NftDetail;
