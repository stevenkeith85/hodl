import { Typography, Stack, Button } from '@mui/material';
import { Build } from '@mui/icons-material';
import { FC } from 'react';
import { useSnackbar } from 'notistack';
import { mintToken } from '../../lib/mint';
import { MintProps } from './models';


export const MintTokenAction: FC<MintProps> = ({ 
  stepComplete,
  loading, 
  setLoading, 
  setStepComplete,
  formData,
  setFormData
 }: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();

  async function mint() {
    setLoading(true);
    enqueueSnackbar('Please approve the transaction in MetaMask', { variant: "info" });

    const {metadataUrl} = formData;

    try {
      const tokenId = await mintToken(metadataUrl);
      setLoading(false);

      setFormData(prev => ({
        ...prev,
        tokenId
      }));

      enqueueSnackbar(`NFT minted on the blockchain with token id ${tokenId}`, { variant: "success" });
      setStepComplete(2);
    } catch (e) {
      enqueueSnackbar('Unable to mint at the moment. Please try again', { variant: "warning" });
      setLoading(false);
    }
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h2">Mint NFT</Typography>
      <Typography sx={{ span: { fontWeight: 600 } }}>You are now ready to mint your token <span>{formData.name}</span> on the blockchain</Typography>
      <div>
        <Button
          disabled={stepComplete === 2 || loading}
          onClick={mint}
          startIcon={<Build fontSize="large" />}
        >
          Mint Token
        </Button>
      </div>
    </Stack>
  );
}
