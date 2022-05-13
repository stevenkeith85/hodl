import {
  Button,
  Card,
  CardContent,
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
import { token, nonCommercial, commercial } from "../../lib/copyright";

export async function getServerSideProps({ params }) {
  const nft = await fetchNFT(params.tokenId);
  const priceHistory = await getPriceHistory(params.tokenId);

  return {
    props: {
      nft,
      priceHistory
    },
  }
}

const NftDetail = ({ nft, priceHistory }) => {
  return (
    <>
      <Head>
        <title>{nft.name} | {truncateText(nft.description)} | NFT Market | HodlMyMoon</title>
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
            <NoSsr><DetailPageImage token={nft} /></NoSsr>
            <Likes sx={{ color: theme => theme.palette.secondary.main, '.MuiTypography-body1': { color: '#666' } }} tokenId={nft.tokenId} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} marginBottom={2} paddingLeft={{ md: 1 }}>
          <Stack spacing={2}>
            <DescriptionCard nft={nft} />

            { nft.privilege &&
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h3" sx={{ marginBottom: 2 }}>Hodler Privilege</Typography>
                <Stack spacing={2} direction="row">
                  <Tooltip title={token}>
                    <Button
                      color={nft.privilege === token ? 'secondary' : 'primary'}
                    >Token</Button>
                  </Tooltip>
                  <Tooltip title={nonCommercial}>
                    <Button
                      color={nft.privilege === nonCommercial ? 'secondary' : 'primary'}
                    >Non Commercial</Button>
                  </Tooltip>
                  <Tooltip title={commercial}>
                    <Button
                      color={nft.privilege === commercial ? 'secondary' : 'primary'}
                    >Commercial</Button>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
            }

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
