import { memo } from 'react';
import { Typography, Step, StepLabel, Stepper } from '@mui/material';


export const MintStepper = ({ activeStep, stepLabels }) => (
  <Stepper
    activeStep={activeStep}
    alternativeLabel
    sx={{
      width: '100%',
      borderRadius: 1
    }}>
    {stepLabels.map((label, i) => <Step key={i}>
      <StepLabel>
        <Typography sx={{ fontWeight: activeStep == i ? 900 : 400 }}>{stepLabels[i]}</Typography>
      </StepLabel>
    </Step>
    )}
  </Stepper>
);
export const MintStepperMemo = memo(MintStepper);
