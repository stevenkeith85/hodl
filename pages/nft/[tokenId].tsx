import { useContext, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import SellIcon from '@mui/icons-material/Sell';

import {
  HodlSnackbar,
  HodlButton,
  SuccessModal,
  DetailPageImage,
  HodlModal,
  HodlTextField,
  RocketTitle,
  SocialShare,
  ProfileAvatar,
  HodlExternalLink
} from '../../components';
import { WalletContext } from "../_app";
import { buyNft, delistNft, fetchMarketItem, listTokenOnMarket, lookupPriceHistory } from "../../lib/nft";
import { checkForAndDisplaySmartContractErrors, getShortAddress, truncateText } from "../../lib/utils";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

const NftDetail = () => {
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [marketItem, setMarketItem] = useState(null);
  const snackbarRef = useRef();

  const [boughtModalOpen, setBoughtModalOpen] = useState(false);

  const [listModalOpen, setListModalOpen] = useState(false);
  const [delistModalOpen, setDelistModalOpen] = useState(false);
  const [listedModalOpen, setListedModalOpen] = useState(false);

  const [price, setPrice] = useState('');
  
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (router.query.tokenId !== undefined) {
        try {
          const item = await fetchMarketItem(router.query.tokenId);
          if(!item) {
            return;
          }

          setMarketItem(item);
          setPriceHistory(await lookupPriceHistory(router.query.tokenId));
          
        } catch (e) {
          console.log('ERROR', e);
        }
      }
    };

    load();

  }, [router.query.tokenId]);

  return (
    <>
      <HodlSnackbar ref={snackbarRef} />
      
      {/* Bought */}
      <SuccessModal
        modalOpen={boughtModalOpen}
        setModalOpen={setBoughtModalOpen}
        message="You&apos;ve successfully bought a token on the market"
      />

      {/* List */}
      <HodlModal
        open={listModalOpen}
        setOpen={setListModalOpen}
      >
        <Stack spacing={4}>
          <RocketTitle title="Time for Tendies" />
          <Typography sx={{ paddingLeft: 1 }}>
            List this NFT on the market.
          </Typography>
          <HodlTextField
            label="Price (Matic)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="1"
          />
          <HodlButton
            onClick={async () => {
              try {
                // @ts-ignore
                snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                await listTokenOnMarket(router.query.tokenId, price);
                // @ts-ignore
                snackbarRef?.current?.display('Token listed on market', 'success');
                setListModalOpen(false);
                setListedModalOpen(true);
              } catch (e) {
                checkForAndDisplaySmartContractErrors(e, snackbarRef);
              }

            }}
            disabled={!price}
          >
            Add
          </HodlButton>
        </Stack>
      </HodlModal>

      {/* Listed */}
      <SuccessModal
        modalOpen={listedModalOpen}
        setModalOpen={setListedModalOpen}
        message="You&apos;ve successfully listed your token on the market"
      />

      {/* Delisted */}
      <SuccessModal
        modalOpen={delistModalOpen}
        setModalOpen={setDelistModalOpen}
        message="You&apos;ve successfully delisted your token from the market"
      />

      <Grid container spacing={2} sx={{ paddingTop: { xs: 2 } }}>
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h1">{marketItem?.name}</Typography>
            <ProfileAvatar reverse={true} profileAddress={marketItem?.owner} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailPageImage token={marketItem} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
          {Boolean(marketItem) &&
            <Card variant="outlined">
              <CardContent sx={{ whiteSpace: 'pre-line', maxHeight: 500, overflowY: 'auto'}}>
                 <Typography sx={{ marginBottom: 2 }}>Description</Typography>
                 <Typography>{marketItem?.description || "<No description provided>"}</Typography>
              </CardContent>
            </Card>
            }
            <Card variant="outlined">
              <CardContent>
                <Typography sx={{ marginBottom: 2, fontWeight: 500 }}>
                  InterPlanetary File System
                </Typography>
                <Stack direction="row" spacing={2}>
                    <HodlExternalLink href={marketItem?.ipfsMetadataGateway || '#'}>
                      Metadata
                    </HodlExternalLink>
                    <HodlExternalLink href={marketItem?.ipfsImageGateway || '#'}>
                      Image
                    </HodlExternalLink>
                </Stack>
              </CardContent>
            </Card>
            { Boolean(marketItem?.forSale) &&
                <Card variant="outlined">
                <CardContent>
                   <Typography sx={{ marginBottom: 2 }}>Price</Typography>
                   <Typography>{marketItem?.price || "<Price Not Known>"} Matic</Typography>
                </CardContent>
              </Card>
            }
            { Boolean(priceHistory.length) &&
            <Card variant="outlined">
              <CardContent sx={{ whiteSpace: 'pre-line', maxHeight: 500, overflowY: 'auto'}}>
                <Typography sx={{ marginBottom: 2 }}>Price History</Typography>
                <Stack spacing={2}>
                  {priceHistory.map( ({buyer, seller, price, timestamp}) => (<>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center'}}>
                      <Typography>Bought for</Typography>
                      <Typography sx={{ color: (theme) => theme.palette.secondary.dark }}>{`${price}`} Matic</Typography>
                      <Typography>on</Typography>
                      <Typography>{
                        `${new Date(timestamp * 1000).toLocaleString()}`
                      }</Typography>
                      <Typography>({`${getShortAddress(seller)}`} </Typography>
                      <Typography>sold to</Typography>
                      <Typography>{`${getShortAddress(buyer)}`})</Typography>
                    </Stack>
                    </>)
                  )}
                </Stack>
              </CardContent>
            </Card>
            }
            <Stack direction="row" sx={{ justifyContent:"space-between", alignItems: 'center'}}>
            <Stack direction="row" spacing={2}>
              {Boolean(marketItem?.forSale) && Boolean(marketItem?.owner?.toLowerCase() !== address?.toLowerCase()) &&
                <HodlButton
                  startIcon={<SellIcon fontSize="large" />}
                  onClick={async () => {
                    try {
                      // @ts-ignore
                      snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                      await buyNft(marketItem);
                      setBoughtModalOpen(true);
                    } catch (e) {
                      checkForAndDisplaySmartContractErrors(e, snackbarRef);
                    }
                  }}>
                  Buy NFT
                </HodlButton>
              }
              {Boolean(marketItem?.owner?.toLowerCase() === address?.toLowerCase()) &&
                <>
                  {
                    marketItem.forSale ? (
                      <HodlButton
                        startIcon={<SellIcon fontSize="large" />}
                        onClick={async () => {
                          try {
                            // @ts-ignore
                            snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                            await delistNft(marketItem);
                            setDelistModalOpen(true);
                          } catch (e) {
                            checkForAndDisplaySmartContractErrors(e, snackbarRef);
                          }
                        }}>
                        Delist NFT
                      </HodlButton>
                    ) : (
                      <HodlButton
                        startIcon={<SellIcon fontSize="large" />}
                        onClick={() => setListModalOpen(true)}>
                        List NFT
                      </HodlButton>
                    )
                  }
                </>
              }
            </Stack>
            <SocialShare />
            </Stack>
            
            
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default NftDetail;
