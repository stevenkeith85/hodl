import { useState } from 'react'
import { Grid, Box } from '@mui/material'
import { MintProgressButtons } from '../components/mint/MintProgressButtons'
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner'
import { AssetPreview } from '../components/mint/AssetPreview'

import dynamic from "next/dynamic";
import Head from 'next/head'
import { authenticate } from '../lib/jwt'
import { useWarningOnExit } from '../hooks/useWarningOnExit'
import { CropAssetAction } from '../components/mint/CropAssetAction'
import { FilterAssetAction } from '../components/mint/FilterAssetAction'
import { assetTypeFromMimeType } from '../lib/utils'
import { AssetTypes } from '../models/AssetType'

const SelectAssetAction = dynamic(
  () => import('../components/mint/SelectAssetAction').then((module) => module.SelectAssetAction),
  { loading: () => <HodlLoadingSpinner /> }
);
const UploadToIpfsAction = dynamic(
  () => import('../components/mint/UploadToIpfsAction').then((module) => module.UploadToIpfsAction),
  { loading: () => <HodlLoadingSpinner /> }
);
const MintTokenAction = dynamic(
  () => import('../components/mint/MintTokenAction').then((module) => module.MintTokenAction),
  { loading: () => <HodlLoadingSpinner /> }
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
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '100%',
                  width: `100%`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  padding: 1,
                }}
              >
                {activeStep === 0 &&
                  <SelectAssetAction
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                    setLoading={setLoading}
                    setStepComplete={setStepComplete}
                  />
                }
                {activeStep === 1 &&
                  <CropAssetAction
                    formData={formData}
                    setFormData={setFormData}
                    setStepComplete={setStepComplete}
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
            <Grid
              item
              xs={12}
              md={6}>
              <Box
                sx={{
                  height: '100%',
                  width: `100%`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  padding: 1,
                }}
              >
                <AssetPreview
                  formData={formData}
                  setFormData={setFormData}
                  setLoading={setLoading}
                />
              </Box>
            </Grid>
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