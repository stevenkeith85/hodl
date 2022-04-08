import { memo } from 'react';
import { Typography, Step, StepLabel, Stepper } from '@mui/material';

export const MintStepper = ({ activeStep }) => (
  <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', paddingY: 2, paddingTop:4, background: '#f9f9f9', borderRadius: 1 }}>
    <Step key={'upload'}>
      <StepLabel>
        <Typography sx={{ fontWeight: activeStep == 0 ? 900 : 400 }}>Select Asset</Typography>
      </StepLabel>
    </Step>
    <Step key={'ipfs'}>
      <StepLabel>
        <Typography sx={{ fontWeight: activeStep == 1 ? 900 : 400 }}>IPFS Upload</Typography>
      </StepLabel>
    </Step>
    <Step key={'mint'}>
      <StepLabel>
        <Typography sx={{ fontWeight: activeStep == 2 ? 900 : 400 }}>Mint NFT</Typography>
      </StepLabel>
    </Step>
    <Step key={'store'}>
      <StepLabel>
        <Typography sx={{ fontWeight: activeStep == 3 ? 900 : 400 }}>Hodl</Typography>
      </StepLabel>
    </Step>
  </Stepper>
);
export const MintStepperMemo = memo(MintStepper);
