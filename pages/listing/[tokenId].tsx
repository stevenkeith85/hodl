import { Box, Button, Typography, Grid, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { buyNft, delistNft, fetchMarketItem } from "../../lib/nft";
import { WalletContext } from "../_app";
import { HodlTextField } from "../../components/HodlTextField";
import { ConnectWallet } from "../../components/ConnectWallet";
import { DiamondTitle } from "../../components/DiamondTitle";
import Image from 'next/image'
import Link from "next/link";
import { HodlSnackbar } from "../../components/HodlSnackbar";
import { HodlModal } from "../../components/HodlModal";
import { RocketTitle } from "../../components/RocketTitle";
import { HodlButton } from "../../components/HodlButton";


const NftDetail = () => {
  const router = useRouter();
  const { wallet, address, setAddress } = useContext(WalletContext);
  const [marketItem, setMarketItem] = useState(null);
  const snackbarRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);

  function myLoader({src, width, quality}) {
    const url = `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_${700},q_${quality}/nfts/${src}`;
    return url;
  }

  useEffect(() => {
    const load = async () => {
      if (router.query.tokenId !== undefined &&
        wallet.provider !== null &&
        wallet.signer !== null) {
        try {
          const item = await fetchMarketItem(router.query.tokenId);
          if (!item) {
            return;
          }

          setMarketItem(item);
          console.log(item);
        } catch (e) {
          console.log(e);
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
    <>
    <HodlSnackbar ref={snackbarRef} />
    <HodlModal
        open={modalOpen}
        setOpen={setModalOpen}
      >
          <Stack spacing={4}>
            <RocketTitle title="We're off to the Moon" />
            <Typography sx={{ span: { fontWeight: 600 } }}>
              You&apos;ve <span>successfully</span> bought a token on the market
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href={`/nft/${router.query.tokenId}`} passHref>
                <HodlButton color="secondary">
                  View Token Detail
                </HodlButton>
              </Link>
                <Link href={`/profile/${address}`} passHref>
                  <HodlButton>
                    View Profile
                  </HodlButton>
                </Link>
                </Stack>
          </Stack>
    </HodlModal>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", padding: 4 }}>
      <Typography variant='h1' sx={{ paddingBottom: 2 }}>
        <DiamondTitle title="NFT For Sale" />
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>        
              {Boolean(marketItem?.image) &&
              <Image
                loader={myLoader}
                src={marketItem?.image}
                alt={marketItem?.name}
                quality={75}
                width={600}
                height={600}
                sizes="33vw"
                loading="eager"
                layout="responsive"
                objectFit='contain'
                objectPosition="top"
              />}
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <HodlTextField
              label="Name"
              value={marketItem?.name || ''}
            />
            <HodlTextField
              label="Description"
              multiline
              minRows={5}
              value={marketItem?.description || ''}
            />
            <HodlTextField
              label="Price (Matic)"
              value={marketItem?.price || ''}
            />
            <Stack direction="row" spacing={2}>
              <HodlButton
                onClick={async () => {
                  try {
                    // @ts-ignore
                    snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                    await buyNft(marketItem, wallet);
                    router.push(`/profile/${address}`);
                  } catch (e) {
                    if (e.code === -32603) {
                      const re = /reverted with reason string '(.+)'/gi;
                      const matches = re.exec(e.data.message)
                      // @ts-ignore
                      snackbarRef?.current?.display(matches[1], 'error');
                    }
                  }
                }}>
                Buy NFT
              </HodlButton>
              <HodlButton
                onClick={async () => {
                  try {
                    // @ts-ignore
                    snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                    await delistNft(marketItem, wallet);
                    router.push(`/profile/${address}`);
                  } catch (e) {
                    if (e.code === -32603) {
                      const re = /reverted with reason string '(.+)'/gi;
                      const matches = re.exec(e.data.message)
                      // @ts-ignore
                      snackbarRef?.current?.display(matches[1], 'error');
                    }
                  }
                }}>
                Delist NFT
              </HodlButton>
              <Link href={`/nft/${router.query.tokenId}`} passHref>
                <HodlButton
                  color="secondary"
                >
                  View Detail
                </HodlButton>
              </Link>
            </Stack>
          </Stack>
          </Grid>
        </Grid>
    </Box>
    </>
  )
}

export default NftDetail;
