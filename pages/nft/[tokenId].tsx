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
import { getPriceHistory } from "../api/priceHistory/[tokenId]";

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

const NftDetail = ({nft, priceHistory}) => {
  return (
    <>    
      <Head>
        <title>{ nft.name } - { truncateText(nft.description) }</title>
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
              <Typography variant="h2">{truncateText(nft?.name, 100)}</Typography>
            </Tooltip>
            <ProfileAvatar reverse={true} profileAddress={nft?.owner} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} marginBottom={2} paddingRight={{md: 1}}>
          <Stack spacing={2}>
          <NoSsr><DetailPageImage token={nft} /></NoSsr>
            <Likes sx={{ color: theme => theme.palette.secondary.main, '.MuiTypography-body1': {color: '#666'}}} tokenId={nft.tokenId} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} marginBottom={2} paddingLeft={{md: 1}}>
          <Stack spacing={2}>
            <DescriptionCard nft={nft} />
            <IpfsCard nft={nft} />
            { Boolean(nft?.forSale) && <PriceCard nft={nft} />}
            { Boolean(priceHistory.length) && <PriceHistory priceHistory={priceHistory} /> }
            <NftActionButtons nft={nft} />
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default NftDetail;
