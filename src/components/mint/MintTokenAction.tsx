import { Typography, Stack, Button, Box } from '@mui/material';
import { Build, CloudSyncOutlined, SatelliteAlt } from '@mui/icons-material';
import { FC } from 'react';
import { enqueueSnackbar } from 'notistack';
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

  async function mint() {
    setLoading(true);
    enqueueSnackbar(
      'Please approve the transaction in Metamask',
      {
        // @ts-ignore
        variant: "hodlsnackbar",
        type: "info"
      });

    const { metadataUrl } = formData;

    if (metadataUrl.indexOf('ipfs://') === -1) {
      enqueueSnackbar(
        'Expected metadata to be on IPFS. Aborting',
        {
          // @ts-ignore
          variant: "hodlsnackbar",
          type: "error"
        });
    }

    try {
      const tokenId = await mintToken(metadataUrl);
      setLoading(false);

      setFormData(prev => ({
        ...prev,
        tokenId
      }));

      enqueueSnackbar(
        `Once your transaction has been confirmed on the blockchain; we'll add it to the site and send you a notification.`,
        {
          // @ts-ignore
          variant: "hodlsnackbar",
          type: "success"
        });
      
      // setStepComplete(4);
    } catch (e) {
      enqueueSnackbar(
        `Unable to mint at the moment. Please try again`,
        {
          // @ts-ignore
          variant: "hodlsnackbar",
          type: "error"
        });
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
      paddingLeft={8}
    >
      <CloudSyncOutlined sx={{ fontSize: 82, color: grey[400] }} />
      <Typography
        sx={{
          fontSize: '18px',
          color: grey[600],
          span: { fontWeight: 600 }
        }}>Click the button to mint your NFT <span>{formData.name}</span> on the blockchain</Typography>
      <div>
        <Button

          color="secondary"
          disabled={stepComplete === 4 || loading}
          onClick={mint}
        >
          Mint
        </Button>
      </div>
    </Box>
  );
}
