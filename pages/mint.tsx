import { useRef, useState } from 'react'
import { MintForm } from '../components/MintForm'
import { Box, Typography,  Modal, Stack, CircularProgress } from '@mui/material'
import Link from 'next/link'
import { RocketTitle } from '../components/RocketTitle'
import { HodlSnackbar } from '../components/HodlSnackbar'
import { HodlButton } from '../components/HodlButton'
import { HodlModal, SuccessModal } from '../components'
import { getMetaMaskSigner } from '../lib/connections'
import { mintToken } from '../lib/mint'
import { ipfsUriToCloudinaryUrl } from '../lib/utils'


export default function Mint() {
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [unableToSaveModalOpen, setUnableToSaveModalOpen] = useState(false);

  const [tokenUrl, setTokenUrl] = useState('');
  const [tokenId, setTokenId] = useState(null);
  const [imageCid, setImageCid] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');

  const snackbarRef = useRef();

  // upload a photo
  async function onChange(e) {
    setLoading(true);

    const data = new FormData();
    data.append('asset', e.target.files[0]);
    data.append('fileUrl', fileUrl);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });

    const json = await response.json();

    if (response.status === 400) {
      // @ts-ignore
      snackbarRef?.current.display(json.error.message, 'error');
    } else {  
      setFileUrl(json.fileName);
    }
    
    setLoading(false);
    setLoaded(true);
  }

  async function doMint(tokenUrl) {
      const signer = await getMetaMaskSigner();
      
      // @ts-ignore
      snackbarRef?.current.display('Please approve transaction in MetaMask', 'info');
      const tokenId = await mintToken(tokenUrl, signer);
      setTokenId(tokenId);

      // @ts-ignore
      snackbarRef?.current.display(`NFT minted on the blockchain with token id ${tokenId}`, 'success');

      // @ts-ignore
      snackbarRef?.current.display('Storing a copy in our database', 'info');
      
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        body: JSON.stringify({ tokenId })
      });

      if (response.status === 500){
        // @ts-ignore
        snackbarRef?.current.display("Unable to save a copy in our database", "info");
        setUnableToSaveModalOpen(true);
      } else {
        // @ts-ignore
        snackbarRef?.current.display('Successfully a copy in our database', 'success');
        setModalOpen(true);
      } 

      setMinting(false);
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
      console.log(error)
      if (error.code === 4001) {
        // @ts-ignore
        snackbarRef?.current?.display('Transaction rejected', 'error');
        setMinting(false);
      } else if (error.code === -32603) {
        const re = /reverted with reason string '(.+)'/gi;
        const matches = re.exec(error?.data?.message)
        
        
        if (matches) {
          // @ts-ignore
          snackbarRef?.current?.display(matches[1], 'error');
        } else {
          // @ts-ignore
          snackbarRef?.current?.display("We've ran into a problem, sorry", 'error');
          setMinting(false);
        }
      }
      else {
        // @ts-ignore
        snackbarRef?.current?.display("We've ran into a problem, sorry", 'error');
        setMinting(false);
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 4, paddingBottom: 4 }}>
      <HodlSnackbar ref={snackbarRef} />
      <HodlModal
        open={unableToSaveModalOpen}
        setOpen={setUnableToSaveModalOpen}
      >
          <Stack spacing={4}>
            <RocketTitle title="We've ran out of fuel..." />
            <Typography sx={{ span: { fontWeight: 600 } }}>
            <span>Your token was minted on the blockchain</span>, but we had a problem saving a copy to the website's database.
            </Typography>
            <Typography sx={{ span: { fontWeight: 600 } }}>
              Once we store a copy of the token data, it will show up.
            </Typography>
            <Typography sx={{ span: { fontWeight: 600 } }}>
              <span>Do not re-mint your token</span>, click the button below to request your token is added to HodlMyMoon.
            </Typography>
            <Typography sx={{ span: { fontWeight: 600 } }}>
              Your token will automatically appear on the website, once we have processed this request. 
            </Typography>
            <Typography sx={{ span: { fontWeight: 600 } }}>
              The process should take less than 24 hours.
            </Typography>
            
            <Link href={`mailto:support@hodlmymoon.com?subject=Add my HodlNFT to HodlMyMoon (DO NOT EDIT)&body=Please add my HodlNFT to HodlMyMoon. It has the following tokenId: ${tokenId}`} passHref>
              <HodlButton>
                Add My NFT
              </HodlButton>
            </Link>
          </Stack>
      </HodlModal>
      <SuccessModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        message="You&apos;ve successfully minted a token"
      />
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
