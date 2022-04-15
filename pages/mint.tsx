import { useState } from 'react'
import { Stack, Grid, useMediaQuery } from '@mui/material'
import { MintStepperMemo } from '../components/mint/MintStepper'
import { MintProgressButtonsMemo } from '../components/mint/MintProgressButtons'
import { MintTitleMemo } from '../components/mint/MintTitle'
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner'
import { AssetPreview } from '../components/mint/AssetPreview'
import { MintMobileStepper } from '../components/mint/MintMobileStepper'
import theme from '../theme'
import dynamic from "next/dynamic";
import Head from 'next/head'

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
const AddToHodlAction = dynamic(
  () => import('../components/mint/AddToHodlAction').then((module) => module.AddToHodlAction),
  { loading: () => <HodlLoadingSpinner /> }
);

const Mint = () => {
  const [formData, setFormData] = useState<any>({
    fileName: null,
    mimeType: null,
    filter: null,
    name: null,
    description: null,
    metadataUrl: null,
    tokenId: null,
  })

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [stepComplete, setStepComplete] = useState(-1);
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const stepLabels = [
    'Select Asset',
    'IPFS Upload',
    'Mint NFT',
    'Hodl'
  ];

  return (
    <>
      <Head>
        <title>Mint NFT</title>
      </Head>
      <Stack spacing={2} marginY={4}>
        <MintTitleMemo />
        {xs ?
          <MintMobileStepper activeStep={activeStep} setActiveStep={setActiveStep} stepComplete={stepComplete} stepLabels={stepLabels} /> :
          <MintStepperMemo activeStep={activeStep} stepLabels={stepLabels} />
        }
        <Grid container>
          <Grid item xs={12} md={6}
            sx={{
              paddingTop: 2,
              paddingBottom: {
                xs: 4,
                md: 0
              },
              paddingRight: {
                md: 1
              }
            }}>
            {activeStep === 0 &&
              <Stack spacing={4}>
                <SelectAssetAction
                  formData={formData}
                  setFormData={setFormData}
                  loading={loading}
                  setLoading={setLoading}
                  setStepComplete={setStepComplete}
                />
                {!xs && <MintProgressButtonsMemo
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  stepComplete={stepComplete}
                />}
              </Stack>
            }
            {activeStep === 1 &&
              <Stack spacing={4}>
                <UploadToIpfsAction
                  formData={formData}
                  setFormData={setFormData}
                  loading={loading}
                  stepComplete={stepComplete}
                  setLoading={setLoading}
                  setStepComplete={setStepComplete} />
                {!xs && <MintProgressButtonsMemo
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  stepComplete={stepComplete}
                />}
              </Stack>
            }
            {activeStep === 2 &&
              <Stack spacing={6}>
                <MintTokenAction
                  formData={formData}
                  setFormData={setFormData}
                  loading={loading}
                  stepComplete={stepComplete}
                  setLoading={setLoading}
                  setStepComplete={setStepComplete}
                />
                {!xs && <MintProgressButtonsMemo
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  stepComplete={stepComplete}
                />}
              </Stack>
            }
            {activeStep === 3 &&
              <Stack spacing={6}>
                <AddToHodlAction
                  formData={formData}
                  setFormData={setFormData}
                  loading={loading}
                  setLoading={setLoading}
                  stepComplete={stepComplete}
                  setStepComplete={setStepComplete}
                />
              </Stack>
            }
          </Grid>
          <Grid item marginY={2} xs={12} md={6} sx={{ paddingLeft: { md: 1 } }}>
            <AssetPreview
              formData={formData}
              setFormData={setFormData}
              setLoading={setLoading}
            />
          </Grid>
        </Grid>
        <HodlLoadingSpinner
          sx={{
            display: loading ? 'block' : 'none',
            position: 'absolute',
            top: 'calc(50vh - 20px)',
            left: 'calc(50vw - 20px)'
          }}
        />
      </Stack>
    </>
  )
}

export default Mint;