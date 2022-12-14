import { useContext, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { mintToken } from '../../lib/nft';
import { MintTokenModal } from '../modals/MintTokenModal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { WalletContext } from '../../contexts/WalletContext';
import { AssetPreview } from './AssetPreview';


export const MintTokenAction = ({
  stepComplete,
  loading,
  setLoading,
  setStepComplete,
  formData,
  setFormData,
  originalAspectRatio,
  metadata
}) => {
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const { signer } = useContext(WalletContext);

  async function mint() {
    setLoading(true);

    try {
      const { metadataUrl } = formData;

      if (!metadataUrl) {
        throw new Error("Metadata URL is blank");
      }

      if (metadataUrl.indexOf('ipfs://') === -1) {
        throw new Error("Metadata URL is not an IPFS url");
      }

      await mintToken(metadataUrl, signer);

      setStepComplete(4);
      setSuccessModalOpen(true);
    } catch (e) {
      enqueueSnackbar(
        e.message,
        {
          variant: "error",
          hideIconVariant: true
        });
    }
    setLoading(false);
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

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <AssetPreview originalAspectRatio={originalAspectRatio} formData={formData} setFormData={setFormData} />
        <Box sx={{ margin: 2, textAlign: 'center' }}>
          <Typography component="h1" variant="h1" mb={2}>{metadata?.name}</Typography>
          <Box mb={1} sx={{ whiteSpace: 'pre-line' }}>{metadata?.description}</Box>
          <Typography component="p" mb={1} >{metadata?.license}</Typography>
        </Box>

        <div>
          <Button
            color="primary"
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
