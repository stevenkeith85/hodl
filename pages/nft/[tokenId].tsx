import {
  Box,
  Card,
  CardContent,
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
import { PriceHistory } from "../../components/nft/PriceHistory";
import { ProfileAvatar } from "../../components/avatar/ProfileAvatar";
import { Likes } from "../../components/Likes";
import Head from "next/head";
import { getPriceHistory } from "../api/token-bought/[tokenId]";
import { getTagsForToken } from "../api/tags";
import { HodlerPrivilege } from "../../components/nft/HodlerPrivilege";
import { getCommentsForToken } from "../api/comments";
import { HodlCommentsBox } from "../../components/comments/HodlCommentsBox";
import { Comments } from "../../components/comments/Comments";
import { getCommentCount } from "../api/comments/count";
import { useState } from "react";
import { Forum, Insights } from "@mui/icons-material";

import { useRouter } from "next/router";
import { getLikeCount } from "../api/like/token/count";
import { MaticPrice } from "../../components/MaticPrice";
import { indigo } from "@mui/material/colors";
import { insertTagLinks } from "../../lib/templateUtils";
import { authenticate } from "../../lib/jwt";
import { FollowButton } from "../../components/profile/FollowButton";
import { UserAvatarAndHandle } from "../../components/avatar/UserAvatarAndHandle";
import { getUser } from "../api/user/[handle]";


export async function getServerSideProps({ params, req, res }) {
  try {
    await authenticate(req, res);

    const nft = await fetchNFT(params.tokenId);

    if (!nft) {
      return { notFound: true }
    }

    // To populate their avatar
    const owner = await getUser(nft.owner);

    const comment = params.comment;
    const limit = 10;

    const prefetchedTags = await getTagsForToken(params.tokenId);

    const prefetchedComments = await getCommentsForToken(comment ? "comment" : "token", comment ? comment : params.tokenId, 0, limit);
    const prefetchedCommentCount = await getCommentCount(comment ? "comment" : "token", comment ? comment : params.tokenId);

    const priceHistory = await getPriceHistory(params.tokenId);

    const prefetchedLikeCount = await getLikeCount(params.tokenId);

    return {
      props: {
        address: req.address || null,
        nft,
        owner,
        limit,
        prefetchedTags,
        prefetchedComments: [prefetchedComments],
        prefetchedCommentCount,
        priceHistory,
        prefetchedLikeCount
      },
    }
  } catch (e) {
    console.log('e', e)
    return { notFound: true }
  }
}

const NftDetail = ({
  address,
  nft,
  owner,
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
        <Grid item xs={12} marginY={4}>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <Box display="flex" gap={2} alignItems="center">
              <UserAvatarAndHandle user={owner} size={'50px'} fontSize={'18px'}/>
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
                }}
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab key={0} value={0} icon={<Forum />} />
                <Tab key={1} value={1} icon={<Insights />} />
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
                token={true}
                prefetchedLikeCount={prefetchedLikeCount}
                fontSize="22px"
              />
              <Comments
                fontSize="22px"
                nft={nft}
                popUp={false}
                prefetchedCommentCount={prefetchedCommentCount}
                sx={{ color: '#333' }}
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
            <Stack spacing={2}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    paddingBottom={3}
                    mb={3}
                    sx={{ borderBottom: `1px solid #ddd` }}>
                    <Typography variant="h1" mt={1} mb={3} sx={{ fontWeight: 600 }}>{nft.name}</Typography>
                    <Box sx={{ whiteSpace: 'pre-line' }}>{insertTagLinks(nft.description)}</Box>
                  </Box>
                  <HodlCommentsBox
                    tokenId={nft.id}
                    object={comment ? "comment" : "token"}
                    objectId={comment ? comment : nft.id}
                    prefetchedComments={prefetchedComments}
                    prefetchedCommentCount={prefetchedCommentCount}
                    limit={limit}
                  />
                </CardContent>
              </Card>
            </Stack>
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
                <MaticPrice nft={nft} color="black" />
                <NftActionButtons nft={nft} />
              </Box>
              <PriceHistory priceHistory={priceHistory} />
              <HodlerPrivilege nft={nft} />
              <IpfsCard nft={nft} />
            </Box>
          </div>
        </Grid>
      </Grid >
    </>
  )
}

export default NftDetail;

