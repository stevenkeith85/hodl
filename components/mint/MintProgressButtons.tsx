import { memo } from 'react';
import { Stack, Button } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';

export const MintProgressButtons = ({ stepComplete, activeStep, setActiveStep, align="left" }) => (
  <Stack direction="row" sx={{ justifyContent: align, width: '100%' }}>
    <Button endIcon={<KeyboardArrowRight />} disabled={stepComplete < activeStep} variant="outlined" onClick={() => stepComplete === activeStep && setActiveStep(activeStep => activeStep + 1)}> Next</Button>
  </Stack>
);
export const MintProgressButtonsMemo = memo(MintProgressButtons);
