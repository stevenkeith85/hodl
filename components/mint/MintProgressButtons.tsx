import { memo } from 'react';
import { Stack, Button } from '@mui/material';

export const MintProgressButtons = ({ stepComplete, activeStep, setActiveStep, loading }) => (
  <Stack 
    direction="row" 
    sx={{ 
      justifyContent: "space-between", 
      width: '100%' 
    }}
    >
    <Button 
      color="primary"
      sx={{ paddingX: 3, }}
      disabled={loading || activeStep === 0 || stepComplete >= 2} 
      variant="outlined" 
      onClick={() => setActiveStep(activeStep => activeStep - 1)}> 
      Back
      </Button>
    <Button 
      color="secondary"
      sx={{ paddingX: 3, }}
      disabled={loading || stepComplete < activeStep} 
      variant="outlined" 
      onClick={() => setActiveStep(activeStep => activeStep + 1)}> 
      Next
      </Button>
  </Stack>
);
export const MintProgressButtonsMemo = memo(MintProgressButtons);
