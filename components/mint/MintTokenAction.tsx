import { Typography, Stack, Button, Box } from '@mui/material';
import { Build, CloudSyncOutlined, SatelliteAlt } from '@mui/icons-material';
import { FC } from 'react';
import { useSnackbar } from 'notistack';
import { mintToken } from '../../lib/mint';
import { MintProps } from './models';
import { grey } from '@mui/material/colors';


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

    if (metadataUrl.indexOf('ipfs://') === -1) {
      enqueueSnackbar("Expected metadata to be on IPFS. Aborting", { variant: "error" });
    }

    try {
      const tokenId = await mintToken(metadataUrl);
      setLoading(false);

      setFormData(prev => ({
        ...prev,
        tokenId
      }));

      enqueueSnackbar(`NFT minted on the blockchain with token id ${tokenId}`, { variant: "success" });
      setStepComplete(3);
    } catch (e) {
      console.log(e)
      enqueueSnackbar('Unable to mint at the moment. Please try again', { variant: "warning" });
      setLoading(false);
    }
  }

  return (
    <Box 
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="400px"
      gap={4}
    >
      <CloudSyncOutlined sx={{ fontSize: 82, color: grey[400]}} />
      <Typography 
        sx={{ 
          fontSize: '18px',
          color: grey[600],
          span: { fontWeight: 600 } }}>Click the button to mint your NFT <span>{formData.name}</span> on the blockchain</Typography>
      <div>
        <Button
        
          color="secondary"
          disabled={stepComplete === 3 || loading}
          onClick={mint}
        >
          Mint
        </Button>
      </div>
    </Box>
  );
}
