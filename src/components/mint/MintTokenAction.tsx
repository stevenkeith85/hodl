import { Typography, Stack, Button, Box } from '@mui/material';
import { Build, CloudSyncOutlined, SatelliteAlt } from '@mui/icons-material';
import { FC, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { mintToken } from '../../lib/mint';
import { MintProps } from './models';
import { grey } from '@mui/material/colors';
import { SuccessModal } from '../modals/SuccessModal';


export const MintTokenAction: FC<MintProps> = ({
  stepComplete,
  loading,
  setLoading,
  setStepComplete,
  formData,
  setFormData
}: MintProps) => {

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
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
      
      setStepComplete(4);
      setSuccessModalOpen(true);
    } catch (e) {
      setLoading(false);
    }
  }

  return (
    <>
       <SuccessModal
        modalOpen={successModalOpen}
        setModalOpen={setSuccessModalOpen}
        message="Once your token has been confirmed on the blockchain, it will be added to HodlMyMoon and we'll send you a notification"
      />
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="400px"
      gap={4}
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
          color="primary"
          disabled={stepComplete === 4 || loading}
          onClick={mint}
          sx={{ paddingY: 1, paddingX: 3}}
          variant="contained"
        >
          Mint
        </Button>
      </div>
    </Box>
    </>
  );

}
