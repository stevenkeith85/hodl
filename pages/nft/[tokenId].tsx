import { Box, Button, Typography, Grid, Modal, Stack, CircularProgress, Accordion, AccordionDetails, AccordionSummary, Link as MuiLink } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useRef } from "react";
import { fetchToken, listTokenOnMarket } from "../../lib/nft";
import { nftmarketaddress } from '../../config.js'
import { HodlTextField } from "../../components/HodlTextField";
import Link from "next/link";
import { WalletContext } from "../_app";
import { DiamondTitle } from "../../components/DiamondTitle";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { grey } from "@mui/material/colors";
import PublicIcon from '@mui/icons-material/Public';
import { RocketTitle } from "../../components/RocketTitle";
import { HodlSnackbar } from "../../components/HodlSnackbar";
import { HodlModal } from "../../components/HodlModal";
import { HodlButton } from "../../components/HodlButton";
import Image from "next/image";


const nftDetail = () => {
  const router = useRouter();
  const { wallet, address } = useContext(WalletContext);
  const [token, setToken] = useState(null);
  
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

        const token = await fetchToken(router.query.tokenId, wallet);
        setToken(token);

        setLoading(false);
      }
    };

    load();

  }, [router.query.tokenId, wallet]);

  const isOnTheMarket = token?.owner.toLowerCase() === nftmarketaddress.toLowerCase();

  { 
    console.log(address);
    console.log(token);
    }

  if (loading) {
    return (
      <Box sx={{ marginTop: "40vh", display: 'flex', justifyContent: "center", alignItems: "center", alignContent: "center" }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  console.log('token', token)
  return (
    <>
      <HodlSnackbar ref={snackbarRef} />
      <HodlModal
        open={modalOpen}
        setOpen={setModalOpen}
      >
          {!listed ?
            (<>
              <Stack spacing={4}>
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
                {Boolean(address && token && address !== token?.seller) &&
                  <HodlButton
                    onClick={async () => {
                      try {
                        snackbarRef?.current?.display('Please Approve Transaction in Wallet', 'info');
                        await listTokenOnMarket(router.query.tokenId, price, wallet);
                        snackbarRef?.current?.display('Token listed on market', 'success');
                        setListed(true);
                      } catch (e) {
                        if (e.code === -32603) {
                          const re = /reverted with reason string '(.+)'/gi;
                          const matches = re.exec(e.data.message)
                          snackbarRef?.current?.display(matches[1], 'error');
                        }
                      }
                      
                    }}
                    disabled={!price}
                    >
                    Add
                  </HodlButton>
                }
              </Stack>
            </>
            ) :
            (
              <Stack spacing={4}>
                <RocketTitle title="We're off to the Moon" />
                <Typography sx={{ span: { fontWeight: 600 } }}>
                  You've <span>successfully</span> listed your token on the market
                </Typography>
                <Stack direction="row" spacing={2}>
                <Link href={`/listing/${router.query.tokenId}`} passHref>
                  <HodlButton color="secondary">View Listing</HodlButton>
                </Link>
                <Link href={`/profile/${address}`} passHref>
                  <HodlButton>View Profile</HodlButton>
                </Link>
                </Stack>
              </Stack>
            )
          }
      </HodlModal>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", padding: 4 }}>
        <Typography variant='h1' sx={{ paddingBottom: 2 }}>
          <DiamondTitle title="NFT Details" />
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <HodlTextField label="Name" value={token?.name}></HodlTextField>
              <HodlTextField label="Description" value={token?.description}></HodlTextField>
              <Accordion disableGutters elevation={1}
                sx={{
                  color: grey[800],
                  border: (theme) => `1px solid ${grey[400]}`,
                  borderRadius: 1,
                  boxShadow: 'none'
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>NFT Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                        <HodlButton endIcon={<PublicIcon />}>
                          <MuiLink href={token?.ipfsMetadataGateway || '#'} target="_blank" sx={{textDecoration: 'none'}}>
                            View IPFS Metadata
                            </MuiLink>    
                        </HodlButton>
                        <HodlButton endIcon={<PublicIcon />}>
                        <MuiLink href={token?.ipfsImageGateway || '#'} target="_blank" sx={{textDecoration: 'none'}}>
                            View IPFS Image
                          </MuiLink>    
                        </HodlButton>
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Stack spacing={2} direction="row">
                {
                  <HodlButton onClick={() => setModalOpen(true)}>
                    List Item
                  </HodlButton>
                }
                {
                  <Link href={`/listing/${token?.tokenId}`} passHref>
                    <HodlButton>View Listing</HodlButton>
                  </Link>
                }
                { 
                  <Link href={`/profile/${token?.owner}` || '#'} passHref>
                    <HodlButton color="secondary">Owner's Profile</HodlButton>
                  </Link>
                }
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'center'}}>        
            {Boolean(token?.image) &&
            <Image
              src={token?.image}
              alt={token?.name}
              width={600}
              height={600}
              objectFit='contain'
              objectPosition="top"
            />}
        </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default nftDetail;
