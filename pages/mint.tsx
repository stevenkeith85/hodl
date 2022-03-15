import { useContext, useRef, useState } from 'react'
import { MintForm } from '../components/MintForm'
import { ipfsUriToCloudinaryUrl, mintToken } from '../lib/nft.js'
import { WalletContext } from './_app'
import { Box, Typography,  Modal, Stack, CircularProgress } from '@mui/material'
import { ConnectWallet } from '../components/ConnectWallet'
import Link from 'next/link'
import { DiamondTitle } from '../components/DiamondTitle'
import { RocketTitle } from '../components/RocketTitle'
import { HodlSnackbar } from '../components/HodlSnackbar'
import { HodlButton } from '../components/HodlButton'


export default function Mint() {
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const [tokenUrl, setTokenUrl] = useState('');
  const [tokenId, setTokenId] = useState(null);
  const [imageCid, setImageCid] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');

  const { wallet, setWallet, address, setAddress } = useContext(WalletContext);
  const snackbarRef = useRef();

  // upload a photo
  async function onChange(e) {
    setLoading(true);

    const data = new FormData();
    data.append('asset', e.target.files[0]);
    data.append('fileUrl', fileUrl);
    console.log('fileUrl', fileUrl);
    console.log('typeof fileUrl', typeof fileUrl);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });

    const json = await response.json();
    console.log(json)
    setFileUrl(json.fileName);
    
    setLoading(false);
    setLoaded(true);
  }

  
  async function doMint(tokenUrl) {
    if (tokenUrl !== '' && tokenUrl !== 'ipfs://') {
      // @ts-ignore
      snackbarRef?.current.display('Please Approve Transaction in Wallet', 'info');

      const tokenId = await mintToken(tokenUrl, wallet);

      const response = await fetch('/api/store', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        body: JSON.stringify({ tokenId })
      });

      setTokenId(tokenId);

      // @ts-ignore
      snackbarRef?.current.display('New NFT Minted');

      setMinting(false);

      setModalOpen(true);
    }
  }

  async function createItem() {
    try {
      const { name, description } = formInput;
      if (!name || !description || !fileUrl) {
        return;
      }

      setMinting(true);

      if (!tokenUrl) { // If there's no tokenURL, upload to IPFS, save the url, and ask user to do the mint.
        // @ts-ignore
        snackbarRef?.current.display('Uploading Image to IPFS', "info");

        const response = await fetch('/api/ipfs', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
          body: JSON.stringify({ name, description, fileUrl })
        });

        if (response.status === 400) {
          // @ts-ignore
          snackbarRef?.current.display("This exact file has already been uploaded", "error");
          setMinting(false);
          return;
        }

        const json = await response.json();
        
        setCloudinaryUrl(ipfsUriToCloudinaryUrl(`ipfs://${json.imageCid}`));
        setTokenUrl(json.metadataUrl);
        setImageCid(json.imageCid);
        await doMint(json.metadataUrl);
      } else {
        // if there is a tokenURL already, then the user has likely previously cancelled the mint operation in metamask.
        // just use the exitising data if they try again.
        await doMint(tokenUrl);
      }
    } catch (error) {
      console.log(error);

      if (error.code === 4001) {
        // @ts-ignore
        snackbarRef?.current?.display('Transaction rejected', 'error');
        setMinting(false);
      } else {
        // @ts-ignore
        snackbarRef?.current?.display("We've ran into a problem, sorry", 'error');
        setMinting(false);
      }
    }
  }

  if (!wallet.signer) {
    return (<ConnectWallet />)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant='h1' sx={{ paddingBottom: 2 }}>
        <DiamondTitle title="Mint NFT" />
      </Typography>

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
          <Stack spacing={4}>
            <RocketTitle title="We're off to the Moon" />
            <Typography sx={{ span: { fontWeight: 600 } }}>
              You&apos;ve <span>successfully</span> minted a new token.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href={`/nft/${tokenId}`} passHref>
                <HodlButton color="secondary" variant="outlined" sx={{ padding: 2 }}>
                  View Token Details
                </HodlButton>
              </Link>
              <Link href={`/profile/${address}`} passHref>
                <HodlButton variant="outlined" sx={{ padding: 2 }}>
                  View Profile
                </HodlButton>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Modal>
      {Boolean(minting) && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} color="secondary" />}
      <MintForm
        formInput={formInput}
        updateFormInput={updateFormInput}
        onChange={onChange}
        fileUrl={fileUrl}
        createItem={createItem}
        loading={loading}
        loaded={loaded}
        minting={minting}
        cloudinaryUrl={cloudinaryUrl}
      />
    </Box>
  )
}
