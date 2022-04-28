import { memo } from 'react';
import { Stack, Button } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

export const MintProgressButtons = ({ stepComplete, activeStep, setActiveStep, loading }) => (
  <Stack direction="row" sx={{ justifyContent: "space-between", width: '100%' }}>
    <Button startIcon={<KeyboardArrowLeft />} disabled={loading || activeStep !== 1 || stepComplete === 1} variant="outlined" onClick={() => setActiveStep(activeStep => activeStep - 1)}> Back</Button>
    <Button endIcon={<KeyboardArrowRight />} disabled={loading || stepComplete < activeStep} variant="outlined" onClick={() => stepComplete === activeStep && setActiveStep(activeStep => activeStep + 1)}> Next</Button>
  </Stack>
);
export const MintProgressButtonsMemo = memo(MintProgressButtons);
