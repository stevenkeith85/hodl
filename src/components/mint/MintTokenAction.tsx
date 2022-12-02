import { FC, useContext, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { mintToken } from '../../lib/nft';
import { MintProps } from './models';
import { grey } from '@mui/material/colors';
import { MintTokenModal } from '../modals/MintTokenModal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

  const { signer } = useContext(WalletContext);
  const [error, setError] = useState('');


  useEffect(() => {
    const displayError = async () => {
      const enqueueSnackbar = await import('notistack').then(mod => mod.enqueueSnackbar);

      if (!error) {
        return;
      }

      enqueueSnackbar(error, {
        variant: "error",
        hideIconVariant: true
      });

      setError('');
    }

    displayError().catch(console.error)

  }, [error]);


  async function mint() {
    try {
      setLoading(true);

      enqueueSnackbar(
        'Confirm the transaction in your Wallet to mint',
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
          return;
      }

      await mintToken(metadataUrl, signer);

      setStepComplete(4);
      setSuccessModalOpen(true);
    } catch (e) {
      setLoading(false);
      setError(e.message);
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
        <Typography
          sx={{
            fontSize: '18px',
            color: grey[600],
            span: { fontWeight: 600 }
          }}>You will be asked to confirm the transaction in your wallet</Typography>
        <div>
          <Button
            color="primary"
            // disabled={loading || stepComplete === 4}
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
