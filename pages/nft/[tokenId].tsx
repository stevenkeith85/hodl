import { Box, Button, Typography, Grid, Modal, Stack, CircularProgress, Accordion, AccordionDetails, AccordionSummary, Link as MuiLink } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useRef } from "react";
import { fetchToken, listTokenOnMarket } from "../../lib/nft";
import { nftmarketaddress } from '../../config.js'
import { HodlTextField } from "../../components/HodlTextField";
import Link from "next/link";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { WalletContext } from "../_app";
import { DiamondTitle } from "../../components/DiamondTitle";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { grey } from "@mui/material/colors";
import PublicIcon from '@mui/icons-material/Public';
import { RocketTitle } from "../../components/RocketTitle";
import { HodlSnackbar } from "../../components/HodlSnackbar";


const nftDetail = () => {
  const router = useRouter();
  const { wallet } = useContext(WalletContext);
  const [marketItem, setMarketItem] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [price, setPrice] = useState('');
  const [listed, setListed] = useState(false);
  const snackbarRef = useRef();

  useEffect(() => {
    const load = async () => {
      if (router.query.tokenId !== undefined &&
        wallet.provider !== null &&
        wallet.signer !== null) {
        setLoading(true);
        const marketItem = await fetchToken(router.query.tokenId, wallet);
        setMarketItem(marketItem);
        setLoading(false);
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

  if (loading) {
    return (
      <Box sx={{ marginTop: "40vh", display: 'flex', justifyContent: "center", alignItems: "center", alignContent: "center" }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <>
      <HodlSnackbar ref={snackbarRef} />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          {!listed ?
            (<>
              <Stack spacing={3}>
                  <RocketTitle title="Time for Tendies" />
                  <Typography sx={{ paddingLeft: 1}}>
                    List this NFT on the market.
                  </Typography>
                <HodlTextField
                  label="Price (Matic)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="1"
                />
                {Boolean(address && marketItem && address !== marketItem?.seller) &&
                  <Button
                    onClick={async () => {
                      snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                      await listTokenOnMarket(router.query.tokenId, price, wallet);
                      snackbarRef?.current?.display('Token listed on market', 'success');
                      setListed(true);
                    }}
                    disabled={!price}
                    variant="contained"
                    color="primary"
                    sx={{ padding: 2 }}>
                    Add
                  </Button>
                }
              </Stack>
            </>
            ) :
            (
              <Stack spacing={2}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  <RocketLaunchIcon color="secondary" /> We're off to the moon
                </Typography>
                <Typography sx={{ span: { fontWeight: 600 } }}>
                  You've <span>successfully</span> listed your token on the market
                </Typography>
                <Link href={`/listing/${router.query.tokenId}`} passHref>
                  <Button variant="contained" sx={{ padding: 2 }}>
                    View Token Listing
                  </Button>
                </Link>
              </Stack>

            )
          }
        </Box>
      </Modal>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", padding: 4 }}>
        <Typography variant='h1' sx={{ paddingBottom: 2 }}>
          <DiamondTitle title="NFT Details" />
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <HodlTextField
                label="Name"
                value={marketItem?.name}
              />
              <HodlTextField
                label="Description"
                value={marketItem?.description}
              />
              <Accordion disableGutters elevation={1}
                sx={{
                border: (theme) => `1px solid ${grey[400]}`,
                borderRadius: 1,
                boxShadow: 'none'
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>NFT Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {/* <Stack direction="row" spacing={2} >
                      <HodlTextField
                        label="Contract Address"
                        value={nftaddress}
                        fullWidth
                      />
                      <HodlTextField
                        label="Token ID"
                        value={router?.query?.tokenId || ''}
                        fullWidth
                      />
                    </Stack> */}
                    <Stack direction="row" spacing={2}>
                        <Button fullWidth variant="outlined" sx={{ padding: 2 }} endIcon={<PublicIcon />}>
                          <MuiLink href={marketItem?.ipfsMetadataGateway || '#'} target="_blank" sx={{textDecoration: 'none'}}>
                            View IPFS Metadata
                          </MuiLink>    
                        </Button>
                        <Button fullWidth variant="outlined" sx={{ padding: 2 }} endIcon={<PublicIcon />}>
                          <MuiLink href={marketItem?.ipfsImageGateway || '#'} target="_blank" sx={{textDecoration: 'none'}}>
                            View IPFS Image
                          </MuiLink>    
                        </Button>
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Stack spacing={2} direction="row">
                {Boolean(address && marketItem && marketItem?.owner.toLowerCase() === address.toLowerCase()) &&
                  <Button
                    onClick={() => setModalOpen(true)}
                    variant="outlined"
                    color="secondary"
                    sx={{ width: '50%', padding: 2 }}>
                    List Item for Sale
                  </Button>
                }
                {Boolean(marketItem?.owner.toLowerCase() === nftmarketaddress.toLowerCase()) ?
                  <Link href={`/listing/${marketItem.tokenId}`} passHref>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ width: '50%', padding: 2 }}>
                      View Market Listing
                    </Button>
                  </Link> :
                  <Button
                    disabled={true}
                    variant="outlined"
                    color="secondary"
                    sx={{ width: '50%', padding: 2 }}>
                    Not Listed on Market
                  </Button>
                }
                <Link href={`/profile/${marketItem?.owner}` || '#'} passHref>
                  <Button variant="outlined" sx={{ padding: 2, width: '50%' }}>
                    View Owner's Profile
                  </Button>
              </Link>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ img: { maxWidth: '100%' } }}>
            <Stack spacing={2}>
              <img src={marketItem?.image} />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default nftDetail;
