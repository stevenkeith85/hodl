import { useEffect, useState } from 'react'
import { Grid, useMediaQuery, Box, useTheme, Dialog, DialogTitle, Typography, DialogContent, DialogActions, Button, DialogContentText } from '@mui/material'
import { MintStepperMemo } from '../components/mint/MintStepper'
import { MintProgressButtons } from '../components/mint/MintProgressButtons'
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner'
import { AssetPreview } from '../components/mint/AssetPreview'
import { MintMobileStepper } from '../components/mint/MintMobileStepper'

import dynamic from "next/dynamic";
import Head from 'next/head'
import { authenticate } from '../lib/jwt'
import { useWarningOnExit } from '../hooks/useWarningOnExit'
import { CropAssetAction } from '../components/mint/CropAssetAction'
import { FilterAssetAction } from '../components/mint/FilterAssetAction'

const SelectAssetAction = dynamic(
  () => import('../components/mint/SelectAssetAction').then((module) => module.SelectAssetAction),
  { loading: () => <HodlLoadingSpinner /> }
);
const ApplyFilterAction = dynamic(
  () => import('../components/mint/FilterAssetAction').then((module) => module.FilterAssetAction),
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
// const AddToHodlAction = dynamic(
//   () => import('../components/mint/AddToHodlAction').then((module) => module.AddToHodlAction),
//   { loading: () => <HodlLoadingSpinner /> }
// );

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
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const stepLabels = [
    'Select',
    'Crop',
    'Filter',
    'Upload',
    'Mint',
    'Hodl'
  ];

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
        display={"flex"}
        flexDirection="column"
        sx={{
          position: "relative",
          marginY: {
            xs: 4,
            sm: 5,
            md: 8,
          },
          gap: {
            xs: 4,
            sm: 5,
            md: 7,
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            marginX: 8
          }}>

          <Grid
            container
          >
            <Grid item xs={12} md={6}>
                <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'

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
              {formData.fileName && <Box
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
              marginTop={1}
              xs={12}
              md={6}
              sx={{
                height: `100%`,
                paddingLeft: { md: 1 }
              }}>
              <AssetPreview
                loading={loading}
                formData={formData}
                setFormData={setFormData}
                setLoading={setLoading}
              />
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
          !xs && activeStep < 5 &&
          <MintProgressButtons
            loading={loading}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            stepComplete={stepComplete}
            formData={formData}
          />
        }
        {/* {<pre>{JSON.stringify(formData, null , 2)}</pre>} */}
      </Box>
    </>
  )
}

export default Mint;