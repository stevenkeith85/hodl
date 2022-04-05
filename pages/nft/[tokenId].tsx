import {
  Grid,
  Stack,
  Typography
} from "@mui/material";

import {
  DetailPageImage,
  ProfileAvatar,
  IpfsCard,
  PriceCard,
  DescriptionCard,
  NftActionButtons
} from '../../components';

import { fetchNFT, lookupPriceHistory } from "../../lib/server/nft";
import { PriceHistory } from "../../components/PriceHistory";

export async function getServerSideProps({ params }) {
  const nft = await fetchNFT(params.tokenId);
  const priceHistory = await lookupPriceHistory(params.tokenId);
  
  return {
    props: {
      nft,
      priceHistory
    },
  }
}

const NftDetail = ({nft, priceHistory}) => {
  const SSR = typeof window === 'undefined';

  return (
    <>    
      <Grid container spacing={2} sx={{ paddingTop: { xs: 2 } }}>
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h1">{nft?.name}</Typography>
            <ProfileAvatar reverse={true} profileAddress={nft?.owner} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          { !SSR ?  <DetailPageImage token={nft} /> : null }
        </Grid>
        <Grid item xs={12} md={6}>
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
