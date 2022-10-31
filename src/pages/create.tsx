import { useState } from "react";

import dynamic from "next/dynamic";
import Head from 'next/head'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner'
import { authenticate } from '../lib/jwt'
import { useWarningOnExit } from '../hooks/useWarningOnExit'
import { assetTypeFromMimeType } from '../lib/utils'
import { AssetTypes } from '../models/AssetType'


const SelectAssetAction = dynamic(
  () => import('../components/mint/SelectAssetAction').then((module) => module.SelectAssetAction),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner />
  }
);

const CropAssetAction = dynamic(
  () => import('../components/mint/CropAssetAction').then((module) => module.CropAssetAction),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner />
  }
);

const FilterAssetAction = dynamic(
  () => import('../components/mint/FilterAssetAction').then((module) => module.FilterAssetAction),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner />
  }
);

const UploadToIpfsAction = dynamic(
  () => import('../components/mint/UploadToIpfsAction').then((module) => module.UploadToIpfsAction),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner />
  }
);

const MintTokenAction = dynamic(
  () => import('../components/mint/MintTokenAction').then((module) => module.MintTokenAction),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner />
  }
);

const AssetPreview = dynamic(
  () => import('../components/mint/AssetPreview').then((module) => module.AssetPreview),
  {
    ssr: false,
    loading: () => <HodlLoadingSpinner />
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


const Mint = ({ address }) => {
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
  })
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [stepComplete, setStepComplete] = useState(-1);

  const [originalAspectRatio, setOriginalAspectRatio] = useState(null);

  const warning = useWarningOnExit(stepComplete !== 4 && activeStep > 0, "If you leave now, your token will not be added to Hodl My Moon. Are you sure?")

  if (!address) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Create · Hodl My Moon</title>
      </Head>
      <Box
        sx={{
          position: "relative",
          marginY: 4
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 6,
            minHeight: '60vh',
          }}>

          <Grid
            container
          >
            <Grid
              item
              xs={12}
              md={formData?.fileName ? 5 : 12}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginX: 1,
                  marginY: 2,
                  padding: 1,
                }}
              >
                {activeStep === 0 &&
                  <SelectAssetAction
                    setFormData={setFormData}
                    loading={loading}
                    setLoading={setLoading}
                    setStepComplete={setStepComplete}
                    setOriginalAspectRatio={setOriginalAspectRatio}
                  />
                }
                {activeStep === 1 &&
                  <CropAssetAction
                    formData={formData}
                    setFormData={setFormData}
                    setStepComplete={setStepComplete}
                    originalAspectRatio={originalAspectRatio}
                  />
                }
                {formData.fileName &&
                  assetTypeFromMimeType(formData.mimeType) === AssetTypes.Image &&
                  <Box
                    sx={{
                      display: activeStep === 2 ? 'block' : 'none'
                    }}
                  >
                    <FilterAssetAction
                      formData={formData}
                      setFormData={setFormData}
                      setStepComplete={setStepComplete}
                      activeStep={activeStep}
                    />
                  </Box>
                }
                {activeStep === 3 &&
                  <UploadToIpfsAction
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                    stepComplete={stepComplete}
                    setLoading={setLoading}
                    setStepComplete={setStepComplete} />
                }
                {activeStep === 4 &&
                  <MintTokenAction
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                    stepComplete={stepComplete}
                    setLoading={setLoading}
                    setStepComplete={setStepComplete} />
                }
              </Box>
            </Grid>
            {formData?.fileName && <Grid
              item
              xs={12}
              md={7}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginX: 1,
                  marginY: 2,
                  padding: 1,
                }}
              >
                <AssetPreview
                  originalAspectRatio={originalAspectRatio}
                  formData={formData}
                  setFormData={setFormData}
                  setLoading={setLoading}
                />
              </Box>
            </Grid>}
          </Grid>
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
        {
          activeStep < 5 &&
          <MintProgressButtons
            loading={loading}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            stepComplete={stepComplete}
            formData={formData}
          />
        }
      </Box>
    </>
  )
}

export default Mint;