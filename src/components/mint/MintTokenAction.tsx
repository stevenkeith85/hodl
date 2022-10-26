import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import { FC, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { mintToken } from '../../lib/mint';
import { MintProps } from './models';
import { grey } from '@mui/material/colors';
import { MintTokenModal } from '../modals/MintTokenModal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


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
      'Please confirm the transaction in MetaMask',
      {
        variant: "info",
        hideIconVariant: true
      });

    const { metadataUrl } = formData;

    if (metadataUrl.indexOf('ipfs://') === -1) {
      enqueueSnackbar(
        'Expected metadata to be on IPFS. Aborting',
        {
          variant: "error",
          hideIconVariant: true
        });
    }

    try {
      await mintToken(metadataUrl);
      setLoading(false);


      setStepComplete(4);
      setSuccessModalOpen(true);
    } catch (e) {
      setLoading(false);
    }
  }

  return (
    <>
      <MintTokenModal
        modalOpen={successModalOpen}
        setModalOpen={setSuccessModalOpen}>
        <Typography
          sx={{
            fontSize: 16,
            color: theme => theme.palette.text.secondary,
            span: {
              fontWeight: 600
            }
          }}>
          When your transaction has been <span>confirmed</span> on the blockchain,
          we&apos;ll update our database and send you a notification.
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            color: theme => theme.palette.text.secondary
          }}>
          Please wait until this process completes before triggering another transaction.
        </Typography>
      </MintTokenModal>

      <Box
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="400px"
        gap={4}
      >
        <CloudSyncOutlinedIcon sx={{ fontSize: 50, color: grey[400] }} />
        <Typography
          sx={{
            fontSize: '18px',
            color: grey[600],
            span: { fontWeight: 600 }
          }}>Click the button to mint your NFT <span>{formData.name}</span> on the blockchain</Typography>
        <div>
          <Button
            color="primary"
            disabled={loading || stepComplete === 4}
            onClick={mint}
            sx={{ paddingY: 1, paddingX: 3 }}
            variant="contained"
          >
            Mint
          </Button>
        </div>
      </Box>
    </>
  );
}
