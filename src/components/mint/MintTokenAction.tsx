import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import { FC, useContext, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { mintToken } from '../../lib/mint';
import { MintProps } from './models';
import { grey } from '@mui/material/colors';
import { MintTokenModal } from '../modals/MintTokenModal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { WalletContext } from '../../contexts/WalletContext';


export const MintTokenAction: FC<MintProps> = ({
  stepComplete,
  loading,
  setLoading,
  setStepComplete,
  formData,
  setFormData
}: MintProps) => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { provider, signer } = useContext(WalletContext);

  async function mint() {
    setLoading(true);

    enqueueSnackbar(
      'Please confirm the transaction in your Wallet',
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

    const success = await mintToken(metadataUrl, signer);

    setLoading(false);

    if (success) {
      setStepComplete(4);
      setSuccessModalOpen(true);
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
        <Typography
          sx={{
            fontSize: 16,
            color: theme => theme.palette.text.secondary
          }}>
          You can continue browsing the site whilst waiting.
        </Typography>
      </MintTokenModal>

      <Box
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        gap={4}
      >
        <CloudSyncOutlinedIcon sx={{ fontSize: { xs: 36, sm: 40 }, color: grey[400] }} />
        <Typography
          sx={{
            fontSize: '18px',
            color: grey[600],
            span: { fontWeight: 600 }
          }}>Click the button to mint your NFT <span>{formData.name}</span> on the polygon blockchain</Typography>
        <div>
          <Button
            color="primary"
            disabled={loading || stepComplete === 4}
            onClick={mint}
            sx={{ paddingY: 1, paddingX: 3 }}
            variant="contained"
          >
            Mint Your Token
          </Button>
        </div>
      </Box>
    </>
  );
}
