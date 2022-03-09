import { Box, Button, Typography, Grid, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { buyNft, delistNft, fetchMarketItem } from "../../lib/nft";
import { WalletContext } from "../_app";
import { HodlTextField } from "../../components/HodlTextField";
import { ConnectWallet } from "../../components/ConnectWallet";
import { DiamondTitle } from "../../components/DiamondTitle";
import Image from 'next/image'
import { grey } from "@mui/material/colors";
import Link from "next/link";


const nftDetail = () => {
  const router = useRouter();
  const { wallet, address, setAddress } = useContext(WalletContext);
  const [marketItem, setMarketItem] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (router.query.tokenId !== undefined &&
        wallet.provider !== null &&
        wallet.signer !== null) {
        try {
          const marketItem = await fetchMarketItem(router.query.tokenId);
          setMarketItem(marketItem);

          console.log(marketItem);
        } catch (e) {
          console.log(e);
          router.push(`/nft/${router.query.tokenId}`);
        }
      }
    };

    load();

  }, [router.query.tokenId, wallet]);

  useEffect(() => {
    const load = async () => {
      if (wallet.signer) {
        const address = await wallet.signer.getAddress();
        setAddress(address);
      }
    };

    load();

  }, [wallet]);

  if (!wallet.signer) {
    return (<ConnectWallet />);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", padding: 4 }}>
      <Typography variant='h1' sx={{ paddingBottom: 2 }}>
        <DiamondTitle title="NFT For Sale" />
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <HodlTextField
              label="Name"
              value={marketItem?.name || ''}
            />
            <HodlTextField
              label="Description"
              value={marketItem?.description || ''}
            />
            <HodlTextField
              label="Price (Matic)"
              value={marketItem?.price || ''}
            />
            <Stack direction="row" spacing={2}>
              <Link href={`/nft/${router.query.tokenId}`} passHref>
                <Button
                  fullWidth
                  sx={{ padding: 2 }}
                  variant="outlined"
                  color="secondary"
                >
                  View Detail
                </Button>
              </Link>
              <Button
                fullWidth
                sx={{ padding: 2 }}
                variant="outlined"
                color="secondary"
                onClick={async () => {
                  await buyNft(marketItem, wallet);
                  router.push(`/profile/${address}`);
                }}>
                Buy NFT</Button>
              <Button
                fullWidth
                sx={{ padding: 2 }}
                variant="outlined"
                color="secondary"
                onClick={async () => {
                  await delistNft(marketItem, wallet);
                  router.push(`/profile/${address}`);
                }}>
                Delist NFT
              </Button>
            </Stack>

          </Stack>
        </Grid>
        <Grid item xs={12} md={6} sx={{ img: { maxWidth: '100%' } }}>
          <Box sx={{
            width: '100%',
            minHeight: {
              xs: '500px',
            },
            position: 'relative',
            background: grey[100]
          }}>
            {Boolean(marketItem?.image) && <Image
              src={marketItem?.image}
              alt={marketItem?.name}
              layout="fill"
              objectFit='cover'
            />}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default nftDetail;
