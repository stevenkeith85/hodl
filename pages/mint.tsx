import { useContext, useRef, useState } from 'react'
import { MintForm } from '../components/MintForm'
import { mintToken } from '../lib/nft.js'
import { WalletContext } from './_app'
import { Box, Typography, Snackbar, Alert, Button, Modal, Stack, CircularProgress } from '@mui/material'
import { ConnectWallet } from '../components/ConnectWallet'
import Link from 'next/link'
import { DiamondTitle } from '../components/DiamondTitle'
import { RocketTitle } from '../components/RocketTitle'
import { HodlSnackbar } from '../components/HodlSnackbar'


export default function Mint() {
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const [tokenUrl, setTokenUrl] = useState('');
  const [tokenId, setTokenId] = useState(null);

  const { wallet, setWallet, address, setAddress } = useContext(WalletContext);
  const snackbarRef = useRef();

  // upload a photo
  async function onChange(e) {
    setLoading(true);
    const data = new FormData();
    data.append('asset', e.target.files[0]);

    const response = await fetch('/api/uploadPhoto', {
      method: 'POST',
      body: data,
    });

    const json = await response.json();
    setFileUrl(json.fileName);
    setLoading(false);
    setLoaded(true);
  }

  async function doMint(tokenUrl) {
    if (tokenUrl !== '' && tokenUrl !== 'ipfs://') {
      snackbarRef?.current.display('Please Approve Transaction in Wallet', 'info');

      const tokenId = await mintToken(tokenUrl, wallet);
      setTokenId(tokenId);

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
        snackbarRef?.current.display('Uploading Image to IPFS', "info");

        const response = await fetch('/api/mint', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
          body: JSON.stringify({ name, description, fileUrl })
        });

        const json = await response.json();
        console.log(json)
        setTokenUrl(json.token.url);
        await doMint(json.token.url);
      } else {
        // if there is a tokenURL already, then the user has likely previously cancelled the mint operation in metamask.
        // just use the exitising data if they try again.
        await doMint(tokenUrl);
      }
    } catch (error) {
      console.log(error);

      if (error.code === 4001) {
        snackbarRef?.current?.display('Transaction rejected', 'error');
        setMinting(false);
      } else {
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
        <DiamondTitle title="Mint an NFT" />
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
              You've <span>successfully</span> minted a new token.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href={`/nft/${tokenId}`} passHref>
                <Button color="secondary" variant="outlined" sx={{ padding: 2 }}>
                  View Token Details
                </Button>
              </Link>
              <Link href={`/profile/${address}`} passHref>
                <Button variant="outlined" sx={{ padding: 2 }}>
                  View Profile
                </Button>
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
      />
    </Box>
  )
}
