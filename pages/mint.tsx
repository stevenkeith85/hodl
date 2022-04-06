import { useRef, useState } from 'react'
import { Box, Typography, Stack, CircularProgress, Step, StepLabel, Stepper, Button } from '@mui/material'
import { HodlSnackbar } from '../components/HodlSnackbar'
import { HodlButton, HodlImage, HodlTextField, SuccessModal } from '../components'
import { mintToken } from '../lib/mint'
import { Build, KeyboardArrowLeft, KeyboardArrowRight, Spa } from '@mui/icons-material'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'
import { useIpfsUpload } from '../hooks/useIpfsUpload'
import { useStoreToken } from '../hooks/useStoreToken'
import { UnableToStoreModal } from '../components/UnableToStoreModal'
import { HodlVideo } from '../components/HodlVideo'

export const MintTitle = () => (
  <Stack 
      direction="row" 
      spacing={1} 
      sx={{ 
        alignItems: 'center',
        width: '100%'
      }}>
      <Spa color="secondary"  />
      <Typography color="secondary" pt={2} pb={2} variant="h1">
        Mint
      </Typography>
    </Stack>
)

export default function Mint() {
  const [loading, setLoading] = useState(false);
  
  const [filter, setFilter] = useState(null);

  const [formInput, updateFormInput] = useState({ 
    name: '', 
    description: '' 
  });
  
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [unableToSaveModalOpen, setUnableToSaveModalOpen] = useState(false);

  const [tokenId, setTokenId] = useState(null);
  const snackbarRef = useRef();
  const metadataUrlRef = useRef(null);

  const [uploadToCloudinary] = useCloudinaryUpload();
  const [uploadToIpfs] = useIpfsUpload();
  const [store] = useStoreToken();

  const [fileName, setFileName] = useState(null);
  const [mimeType, setMimeType] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [stepComplete, setStepComplete] = useState(-1);
  
  const isImage = () => mimeType && mimeType.indexOf('image') !== -1;
  const isVideo = () => mimeType && mimeType.indexOf('video') !== -1;

  async function cloudinaryUpload(e) {
    setLoading(true);

    // @ts-ignore
    snackbarRef?.current.display('Large files may take some time', "info");
    const {success, fileName, mimeType} = await uploadToCloudinary(e.target.files[0]);

    if (success) {
      setFileName(fileName);
      setMimeType(mimeType);
      // @ts-ignore
      snackbarRef?.current.display('Asset ready for departure', "success");
      setStepComplete(0);
    } else {
      e.target.value = ''; // clear the input and ask the user to try again
      // @ts-ignore
      snackbarRef?.current.display('Please try again', "warning");
    }
    
    setLoading(false);
  }

  async function ipfsUpload() {
    setLoading(true);
    
    const { name, description } = formInput;

    // @ts-ignore
    snackbarRef?.current.display('Transferring asset to IPFS', "info");
    let {success, imageCid, metadataUrl } = await uploadToIpfs(name, description, fileName, mimeType, filter)
    
    if (success) {
      metadataUrlRef.current = metadataUrl;

      // @ts-ignore
      snackbarRef?.current.display('IPFS Upload Success', "success");
      setStepComplete(1);
    } else {
      // @ts-ignore
      snackbarRef?.current.display('Please try again', "warning");
    }
    
    setLoading(false);
  }

  async function mint() {
    setLoading(true);
    
    // @ts-ignore
    snackbarRef?.current.display('Please approve the transaction in MetaMask', 'info');
    const tokenId = await mintToken(metadataUrlRef.current);

    if (tokenId) {
      setTokenId(tokenId);
      // @ts-ignore
      snackbarRef?.current.display(`NFT minted on the blockchain with token id ${tokenId}`, 'success');
      setStepComplete(2);
    } else {
      // @ts-ignore
       snackbarRef?.current.display('Unable to mint at the moment. Please try again', "warning");
    }
    
    setLoading(false);
  }

  async function hodl() {
    const success = await store(tokenId, mimeType, filter);
    
    if (success) {
      // @ts-ignore
      snackbarRef?.current.display('Successfully added your token to HodlMyMoon', 'success');
      setStepComplete(3);
      setSuccessModalOpen(true);
    } else {
      // @ts-ignore
      setUnableToSaveModalOpen(true);
    }
  
  }

  return (
    <Stack spacing={6} mt={4} sx={{ alignItems: 'center', position: 'relative'}}>
      <HodlSnackbar ref={snackbarRef} />
      <UnableToStoreModal 
        setUnableToSaveModalOpen={setUnableToSaveModalOpen} 
        unableToSaveModalOpen={unableToSaveModalOpen} 
        tokenId={tokenId} 
        retry={hodl}
      />
       <SuccessModal
        modalOpen={successModalOpen}
        setModalOpen={setSuccessModalOpen}
        message="You&apos;ve successfully minted your token and added it to HodlMyMoon"
        tab={0}
      />
      
      {loading && <CircularProgress 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%' 
          }} 
        color="secondary" 
        />
      } 
      
        <MintTitle />
        <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%'}}>
          <Step key={'upload'}>
            <StepLabel>
              <Typography sx={{ fontWeight: activeStep == 0 ? 900: 400}}>Select Asset</Typography>
            </StepLabel>
          </Step>
          <Step key={'ipfs'}>
            <StepLabel>
              <Typography sx={{ fontWeight: activeStep == 1 ? 900: 400}}>IPFS Upload</Typography>
            </StepLabel>
          </Step>
          <Step key={'mint'}>
            <StepLabel>
              <Typography sx={{ fontWeight: activeStep == 2 ? 900: 400}}>Mint NFT</Typography>
            </StepLabel>
          </Step>
          <Step key={'store'}>
            <StepLabel>
              <Typography sx={{ fontWeight: activeStep == 3 ? 900: 400}}>Hodl</Typography>
            </StepLabel>
          </Step>
        </Stepper>
       
        
        <Box
          sx={{
            width: {
              xs: `100%`,
              // sm: `75%`,
              // md: `66%`,
              // lg: `50%`
            }
          }}>
        { activeStep === 0 && 
        <Stack direction="row" spacing={4}>
          <Stack spacing={4} sx={{ width: '50%'}}>
            <Typography variant="h2">Select Asset</Typography>
            <Typography>Upload an asset to be attached to your token. This can be an image, video or audo clip.</Typography>
            <HodlTextField
              type="file"
              onChange={cloudinaryUpload}
              disabled={loading}
              helperText="Images can be up to 10MB. Videos can be up to 100MB"
            />
        </Stack>
        <Stack sx={{ width: '50%' }} spacing={2}>
          <Stack sx={{ border: !fileName ? `1px solid #d0d0d0`: 'none', minHeight: 400, alignItems: 'center', justifyContent: 'center' }}>
                {!fileName && <Typography>Preview will appear here</Typography>}
                {fileName && isImage() && <HodlImage image={ fileName.split('/')[1] } folder='uploads' filter={filter}/>}
                {fileName && isVideo() && <HodlVideo cid={fileName} directory="video/upload" />}
          </Stack>
          <Stack direction="row" spacing={2} sx={{justifyContent:"center"}}>
              <HodlButton onClick={() => setFilter(null)}>none</HodlButton>
              <HodlButton onClick={() => setFilter('e_improve')}>auto</HodlButton>
              <HodlButton onClick={() => setFilter('e_art:athena')}>athena</HodlButton>
              <HodlButton onClick={() => setFilter('e_art:aurora')}>aurora</HodlButton>
              <HodlButton onClick={() => setFilter('e_art:hairspray')}>hairspray</HodlButton>
              <HodlButton onClick={() => setFilter('e_art:peacock')}>peacock</HodlButton>
              <HodlButton onClick={() => setFilter('e_art:primavera')}>primavera</HodlButton>
              <HodlButton onClick={() => setFilter('e_cartoonify')}>cartoonify</HodlButton>
          </Stack>
        </Stack>
        
            
          </Stack>
        }
        { activeStep === 1 && 
        <Stack direction="row" spacing={4} >
          <Stack spacing={4} sx={{ width: '50%'}}>
          <Typography variant="h2">Upload To IPFS</Typography>
          <Typography>Your token metadata and asset will be stored on IPFS</Typography>
          <HodlTextField
              disabled={stepComplete === 1}
              label="Token Name"
              onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
              helperText="A name for your token"
            />
            <HodlTextField
              disabled={stepComplete === 1}
              label="Token Description"
              multiline
              minRows={8}
              onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
              helperText="A multi-line description for your token. No HTML"
            />
            <div>
              <HodlButton
                onClick={ipfsUpload}
                disabled={!formInput.name || !formInput.description || loading || stepComplete === 1}
                startIcon={<Build fontSize="large" />}
              >
                Upload To IPFS
              </HodlButton>
            </div>
        </Stack> 
          <Stack sx={{ border: !fileName ? `1px solid #d0d0d0`: 'none', minHeight: 400, alignItems: 'center', justifyContent: 'center', width: `50%`}}>
              {fileName && isImage() && <HodlImage image={ fileName.split('/')[1] } folder='uploads' filter={filter} />}
              {fileName && isVideo() && <HodlVideo cid={fileName} directory="video/upload" />}
            </Stack>
        </Stack>
        
        }
        { activeStep === 2 && 
        <Stack spacing={4}>
          <Typography variant="h2">Mint NFT</Typography>
          <Typography>Your ERC721 token will be minted on the Polygon blockchain to benefit from low transaction fees.</Typography>
            <div>
            <HodlButton
                onClick={mint}
                disabled={ loading }
                startIcon={<Build fontSize="large" />}
              >
                Mint Token
            </HodlButton>
            </div>
        </Stack> }
        { activeStep === 3 && 
        <Stack spacing={4}>
          <Typography variant="h2">Hodl My Moon</Typography>
          <Typography>Add my token to HodlMyMoon</Typography>
          <div>
            <HodlButton
              onClick={hodl}
              disabled={ loading }
              startIcon={<Build fontSize="large" />}
            >
              Add Token
            </HodlButton>
          </div>
          
        </Stack> }
        </Box>

        <Stack direction="row" sx={{ justifyContent: 'center', width: '100%'}}>
          {/* <Button disabled={stepComplete < 0} onClick={() => setActiveStep(step => step - 1)}><KeyboardArrowLeft /> Previous</Button> */}
          <Button disabled={stepComplete < activeStep} variant="outlined" onClick={() => stepComplete === activeStep && setActiveStep(activeStep => activeStep + 1)}> Next <KeyboardArrowRight /></Button>  
        </Stack>

        
    </Stack>
  )
}
