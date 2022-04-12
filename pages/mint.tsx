import { useRef, useState } from 'react'
import { Box, Typography, Stack, CircularProgress, Grid } from '@mui/material'

import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'
import { useIpfsUpload } from '../hooks/useIpfsUpload'
import { mintToken } from '../lib/mint'
import { useStoreToken } from '../hooks/useStoreToken'

import { HodlVideo } from '../components/HodlVideo'
import { MintStepperMemo } from '../components/mint/MintStepper'
import { MintProgressButtonsMemo } from '../components/mint/MintProgressButtons'
import { FilteredImageMemo } from '../components/mint/FilteredImage'
import { MintTitleMemo } from '../components/mint/MintTitle'

import { HodlSnackbar } from '../components';
import { SuccessModal } from '../components';
import { UnableToStoreModal } from '../components/UnableToStoreModal';

import dynamic from "next/dynamic";
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner'
import { FilteredVideoMemo } from '../components/mint/FilteredVideo'

const SelectAssetAction = dynamic(
  // @ts-ignore
  () => import('../components/mint/SelectAssetAction').then((module) => module.SelectAssetAction),
  {loading: () => <HodlLoadingSpinner />}
);
const UploadToIpfsAction = dynamic(
  // @ts-ignore
  () => import('../components/mint/UploadToIpfsAction').then((module) => module.UploadToIpfsAction),
  {loading: () => <HodlLoadingSpinner />}
);
const MintTokenAction = dynamic(
  // @ts-ignore
  () => import('../components/mint/MintTokenAction').then((module) => module.MintTokenAction),
  {loading: () => <HodlLoadingSpinner />}
);
const AddToHodlAction = dynamic(
  // @ts-ignore
  () => import('../components/mint/AddToHodlAction').then((module) => module.AddToHodlAction),
  {loading: () => <HodlLoadingSpinner />}
);

export const AssetPreview = ({ fileName, isImage, isVideo, filter, setLoading}) => (
  <Stack spacing={2} sx={{ flexBasis: `50%`, justifyContent: 'center' }}>
      
      <Stack
        sx={{
          border: !fileName ? `1px solid #d0d0d0` : 'none',
          flexGrow: 1,
          minHeight: 400,
          borderRadius: `5px`,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {!fileName && <Typography>Preview will appear here</Typography>}
        {fileName && isImage() && <FilteredImageMemo filter={filter} fileName={fileName} setLoading={setLoading} />}
        {fileName && isVideo() && <FilteredVideoMemo filter={filter} fileName={fileName} setLoading={setLoading} />}
      </Stack>
      {/* <Typography sx={{ justifyContent: "right"}}>{ filter }</Typography> */}
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
    const { success, fileName, mimeType } = await uploadToCloudinary(e.target.files[0]);

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
      setLoading(false);
    }
  }

  async function ipfsUpload() {
    setLoading(true);

    const { name, description } = formInput;

    // @ts-ignore
    snackbarRef?.current.display('Transferring asset to IPFS', "info");
    let { success, imageCid, metadataUrl } = await uploadToIpfs(name, description, fileName, mimeType, filter)

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

    try {
      const tokenId = await mintToken(metadataUrlRef.current);

      setTokenId(tokenId);
      // @ts-ignore
      snackbarRef?.current.display(`NFT minted on the blockchain with token id ${tokenId}`, 'success');
      setStepComplete(2); 
    } catch(e) {
      // @ts-ignore
      snackbarRef?.current.display('Unable to mint at the moment. Please try again', "warning");
      setLoading(false);
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
    <Stack spacing={4} mt={4}>
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

      {loading && <HodlLoadingSpinner sx={{ position: 'absolute', top: 'calc(50vh - 20px)', left: 'calc(50vw - 20px)'}}/>}

      <MintTitleMemo />
      <MintStepperMemo activeStep={activeStep} />
      <Grid container>
        <Grid item xs={12} md={6} 
          sx={{
            paddingBottom: {
              xs: 4,
              md: 0
            },
            paddingRight: {
              md: 2
          }}}>
        {activeStep === 0 &&
          <Stack spacing={12}>
                {/* @ts-ignore */}
                <SelectAssetAction cloudinaryUpload={cloudinaryUpload} loading={loading} filter={filter} setFilter={setFilter} />
                <MintProgressButtonsMemo activeStep={activeStep} setActiveStep={setActiveStep} stepComplete={stepComplete} />
          </Stack>
        }
        {activeStep === 1 &&
          <Stack spacing={4}>
              {/* @ts-ignore */}
              <UploadToIpfsAction formInput={formInput} ipfsUpload={ipfsUpload} loading={loading} stepComplete={stepComplete} updateFormInput={updateFormInput} />
              <MintProgressButtonsMemo activeStep={activeStep} setActiveStep={setActiveStep} stepComplete={stepComplete} />
          </Stack>
        }
        {activeStep === 2 &&
          <Stack spacing={12}>
              {/* @ts-ignore */}
              <MintTokenAction name={formInput.name} loading={loading} mint={mint} stepComplete={stepComplete} activeStep={activeStep} setActiveStep={setActiveStep} />
              <MintProgressButtonsMemo activeStep={activeStep} setActiveStep={setActiveStep} stepComplete={stepComplete} />
          </Stack>
        }
        {activeStep === 3 &&
          <Stack spacing={12}>
               {/* @ts-ignore */}
              <AddToHodlAction name={formInput.name} loading={loading} stepComplete={stepComplete} hodl={hodl} />
          </Stack>
        }
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={6}
          sx={{
            paddingLeft: {
              md: 2
          }
          }}
          >
            <AssetPreview fileName={fileName} filter={filter} isImage={isImage} isVideo={isVideo} setLoading={setLoading} />
        </Grid>
      </Grid>
    </Stack>
  )
}
