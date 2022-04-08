import { Typography, Stack } from '@mui/material';
import { HodlButton } from '../index';
import { Build } from '@mui/icons-material';
import { MintProgressButtonsMemo } from './MintProgressButtons';

export const MintTokenAction = ({ name, stepComplete, loading, mint, activeStep, setActiveStep }) => (
  <Stack spacing={4} sx={{  }}>
    <Typography variant="h2">Mint NFT</Typography>
    <Typography sx={{ span: { fontWeight: 600 } }}>You are now ready to mint your token <span>{name}</span> on the blockchain</Typography>
    <div>
      <HodlButton
        disabled={stepComplete === 2 || loading}
        onClick={mint}
        startIcon={<Build fontSize="large" />}
      >
        Mint Token
      </HodlButton>
    </div>
    <MintProgressButtonsMemo activeStep={activeStep} setActiveStep={setActiveStep} stepComplete={stepComplete} />
  </Stack>
);
