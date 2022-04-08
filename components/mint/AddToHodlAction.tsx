import { Typography, Stack } from '@mui/material';
import { HodlButton } from '../index';
import { Rocket } from '@mui/icons-material';

export const AddToHodlAction = ({ name, stepComplete, loading, hodl }) => (
  <Stack spacing={4} sx={{  }}>
    <Typography variant="h2">Hodl My Moon</Typography>
    <Typography sx={{ span: { fontWeight: 600 } }}>You can now add your token <span>{name}</span> to HodlMyMoon</Typography>
    <div>
      <HodlButton
        onClick={hodl}
        disabled={stepComplete === 3 || loading}
        startIcon={<Rocket fontSize="large" />}
      >
        Add Token
      </HodlButton>
    </div>
  </Stack>
);
