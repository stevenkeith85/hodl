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
import router, { Router, useRouter } from 'next/router'
import { useWarningOnExit } from '../hooks/useWarningOnExit'

const SelectAssetAction = dynamic(
  () => import('../components/mint/SelectAssetAction').then((module) => module.SelectAssetAction),
  { loading: () => <HodlLoadingSpinner /> }
);
const ApplyFilterAction = dynamic(
  () => import('../components/mint/ApplyFilterAction').then((module) => module.ApplyFilterAction),
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

export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

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
    filter: null,
    name: null,
    description: null,
    privilege: null,
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
    'Filter',
    'Upload',
    'Mint',
    'Hodl'
  ];

  const warning = useWarningOnExit(stepComplete !== 4 && activeStep > 0, "If you leave now, your token will not be added to Hodl My Moon. Are you sure?")
  

  return (
    <>
      <Head>
        <title>Create NFTs | HodlMyMoon</title>
      </Head>
      <Box
        display={"flex"}
        flexDirection="column"
        sx={{
          marginY: {
            xs: 4,
            sm: 5,
            md: 7,
          },
          gap: {
            xs: 4,
            sm: 5,
            md: 7,
          }
        }}
      >
        {xs ?
          <MintMobileStepper activeStep={activeStep} setActiveStep={setActiveStep} stepComplete={stepComplete} stepLabels={stepLabels} /> :
          <MintStepperMemo activeStep={activeStep} stepLabels={stepLabels} />
        }
        <Grid
          container
        >
          <Grid item xs={12} md={6}
            sx={{
              height: `100%`,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 1,
              paddingBottom: {
                xs: 4,
                md: 0
              },
              paddingRight: {
                md: 1
              }
            }}>
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
              <ApplyFilterAction
                formData={formData}
                setFormData={setFormData}
                setStepComplete={setStepComplete}
              />
            }
            {activeStep === 2 &&
              <UploadToIpfsAction
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                stepComplete={stepComplete}
                setLoading={setLoading}
                setStepComplete={setStepComplete} />
            }
            {activeStep === 3 &&
              <MintTokenAction
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                stepComplete={stepComplete}
                setLoading={setLoading}
                setStepComplete={setStepComplete} />
            }
            {activeStep === 4 &&
              <AddToHodlAction
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                setLoading={setLoading}
                stepComplete={stepComplete}
                setStepComplete={setStepComplete} />
            }

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
            top: 'calc(50vh - 20px)',
            left: 'calc(50vw - 20px)'
          }}
        />
        {
          !xs && activeStep < 4 &&
          <Box >
            <MintProgressButtons
              loading={loading}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              stepComplete={stepComplete}
              formData={formData}
            />
          </Box>
        }
      </Box>
    </>
  )
}

export default Mint;