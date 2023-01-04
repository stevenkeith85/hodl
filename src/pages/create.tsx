import { useState } from "react";

import dynamic from "next/dynamic";
import Head from 'next/head'

import Box from '@mui/material/Box';

import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner'
import { authenticate } from '../lib/jwt'
import { useWarningOnExit } from '../hooks/useWarningOnExit'

// TODO: Can maybe SSR these

const CentredSpinner = ({}) => (
  <Box sx={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center'}}><HodlLoadingSpinner /></Box>
)

const SelectAssetAction = dynamic(
  () => import('../components/mint/SelectAssetAction').then((module) => module.SelectAssetAction),
  {
    ssr: false,
    loading: () => <CentredSpinner />
  }
);

const CropAssetAction = dynamic(
  () => import('../components/mint/CropAssetAction').then((module) => module.CropAssetAction),
  {
    ssr: false,
    loading: () => <CentredSpinner />
  }
);

const FilterAssetAction = dynamic(
  () => import('../components/mint/FilterAssetAction').then((module) => module.FilterAssetAction),
  {
    ssr: false,
    loading: () => <CentredSpinner />
  }
);

const UploadMetadataAction = dynamic(
  () => import('../components/mint/UploadMetadataAction').then((module) => module.UploadMetadataAction),
  {
    ssr: false,
    loading: () => <CentredSpinner />
  }
);

const MintTokenAction = dynamic(
  () => import('../components/mint/MintTokenAction').then((module) => module.MintTokenAction),
  {
    ssr: false,
    loading: () => <CentredSpinner />
  }
);

const MintProgressButtons = dynamic(
  () => import('../components/mint/MintProgressButtons').then((module) => module.MintProgressButtons),
  {
    ssr: false,
    loading: () => null
  }
);

export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

  if (!req.address) {
    return { notFound: true }
  }

  return {
    props: {
      address: req.address || null,
    }
  }
}


const Create = ({ address }) => {

  // This is what is on the UI
  const [formData, setFormData] = useState<any>({
    fileName: null,
    mimeType: null,
    aspectRatio: null,
    filter: null,
    name: null,
    description: null,
    license: null,
    metadataUrl: null,
    tokenId: null,
    imageCid: null,
    assetCid: null
  })

  // This is populated after a successful upload, so we can show the user what they are about to mint on the 
  // confirmation screen
  const [metadata, setMetadata] = useState({
    name: null,
    description: null,
    license: null
  })

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [stepComplete, setStepComplete] = useState(-1);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(null);

  const warning = useWarningOnExit(activeStep > 0 && activeStep < 4, "If you leave now, your token will not be added to Hodl My Moon. Are you sure?")

  if (!address) {
    return null;
  }

  return (
    <>
      {/* <Box sx={{
        position: 'absolute',
        padding: 3,
        border: `1px solid red`,
        background: 'white',
        width: '200px',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}>
        <h3>Debug Box</h3>
        <div style={{ border: '1px solid #ddd'}}>
          formdata:
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
        <div style={{ border: '1px solid #ddd'}}>
          metadata:
          <pre>{JSON.stringify(metadata, null, 2)}</pre>
        </div>
        
        activestep {activeStep}<br></br>
        stepcomplete {stepComplete}
      </Box> */}

      <Head>
        <title>Create an NFT</title>
      </Head>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          marginY: 4,
          marginX: 2,
          minHeight: {
            xs: '620px',
            md: '720px',
          },
          justifyContent: {
            xs:'center'
          }
        }}>
        <Box sx={{
          display: activeStep === 0 ? 'flex' : 'none',
          width: '100%'
        }}>
          <SelectAssetAction
            setFormData={setFormData}
            loading={loading}
            setLoading={setLoading}
            setStepComplete={setStepComplete}
            setActiveStep={setActiveStep}
            setOriginalAspectRatio={setOriginalAspectRatio}
          />
        </Box>
        <Box sx={{
          display: activeStep === 1 ? 'flex' : 'none',
          width: '100%'
        }}>
          <CropAssetAction
            formData={formData}
            setFormData={setFormData}
            stepComplete={stepComplete}
            setStepComplete={setStepComplete}
            originalAspectRatio={originalAspectRatio}
          />
        </Box>
        <Box sx={{
          display: activeStep === 2 ? 'flex' : 'none', //  TODO: We will need to limit this to images once we support other mime types assetTypeFromMimeType(formData.mimeType) === AssetTypes.Image 
          width: '100%'
        }}>
          <FilterAssetAction
            formData={formData}
            setFormData={setFormData}
            stepComplete={stepComplete}
            setStepComplete={setStepComplete}
            activeStep={activeStep}
            originalAspectRatio={originalAspectRatio}
          />
        </Box>
        <Box sx={{
          display: activeStep === 3 ? 'flex' : 'none',
          width: '100%'
        }}>
          <UploadMetadataAction
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            stepComplete={stepComplete}
            setLoading={setLoading}
            setStepComplete={setStepComplete} 
            setMetadata={setMetadata}
            />
        </Box>
        <Box sx={{
          display: activeStep === 4 ? 'flex' : 'none',
          width: '100%'
        }}>
          <MintTokenAction
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            stepComplete={stepComplete}
            setLoading={setLoading}
            setStepComplete={setStepComplete}
            originalAspectRatio={originalAspectRatio}
            metadata={metadata}
          />
        </Box>
        {
          <MintProgressButtons
            loading={loading}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            stepComplete={stepComplete}
            formData={formData}
            setFormData={setFormData}
            setStepComplete={setStepComplete}
          />
        }
        <HodlLoadingSpinner
          sx={{
            padding: 0,
            display: loading ? 'block' : 'none',
            position: 'absolute',
            top: 'calc(50% - 20px)',
            left: 'calc(50% - 20px)'
          }}
        />
      </Box>
    </>
  )
}

export default Create;