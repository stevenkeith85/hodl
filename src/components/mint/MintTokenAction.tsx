import { useContext, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { mintToken, mintTokenGasless } from '../../lib/nft';
import { MintTokenModal } from '../modals/MintTokenModal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { WalletContext } from '../../contexts/WalletContext';
import { AssetPreview } from './AssetPreview';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { BiconomyContext } from '../../contexts/BiconomyContext';
import useSWR from 'swr';


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
  const [royaltyFeePercent, setRoyaltyFeePercent] = useState("");

  const { signer, walletAddress } = useContext(WalletContext);
  const { biconomy } = useContext(BiconomyContext);


  let { data } = useSWR(
    walletAddress ? [`/api/metatx/checkLimits`, walletAddress] : null,
    (url, address) => fetch(`${url}?address=${address}`).then(data => data.json()),
  )


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

      await mintToken(metadataUrl, Number(royaltyFeePercent) * 100, signer);

      setStepComplete(4);
      setSuccessModalOpen(true);
    } catch (e) {
      enqueueSnackbar(
        e.reason || e.message,
        {
          variant: "error",
          hideIconVariant: true
        });
    }
    setLoading(false);
  }

  function onSuccess() {
    setStepComplete(4);
    setSuccessModalOpen(true);
  }

  function onError() {
    enqueueSnackbar(
      "Sorry. We weren't able to process your gasless TX",
      {
        variant: "error",
        hideIconVariant: true
      });
  }

  async function mintGasless() {
    setLoading(true);

    try {
      const { metadataUrl } = formData;

      if (!metadataUrl) {
        throw new Error("Metadata URL is blank");
      }

      if (metadataUrl.indexOf('ipfs://') === -1) {
        throw new Error("Metadata URL is not an IPFS url");
      }

      await mintTokenGasless(
        metadataUrl, 
        Number(royaltyFeePercent) * 100, 
        walletAddress, 
        biconomy,
        onSuccess,
        onError
        );
    } catch (e) {
      enqueueSnackbar(
        e.reason || e.message,
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
        justifyContent: 'center',
        gap: 4,
      }}>
        <AssetPreview
          originalAspectRatio={originalAspectRatio}
          formData={formData}
          setFormData={setFormData}
        />
        <Box sx={{ margin: 2, textAlign: 'center' }}>
          <Typography component="h1" variant="h1" mb={2}>{metadata?.name}</Typography>
          <Box mb={1} sx={{ whiteSpace: 'pre-line' }}>{metadata?.description}</Box>
          <Typography component="p" mb={1} >{metadata?.license}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            gap: 2
          }}
        >
          <div>
            <TextField
              InputLabelProps={{ shrink: true }}
              type="number"
              value={royaltyFeePercent}
              onChange={e => {
                const valid = e?.target?.value?.match(/^\b(([0-9]|1[0-5])\b\.{0,1}\d{0,2}$)/);

                if (e.target.value === "" || valid) {
                  setRoyaltyFeePercent(e.target.value)
                }
              }}
              label="Royalty Fee"
              inputProps={{
                min: 0,
                max: 15,
                step: 1,
                maxLength: 3
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            ></TextField>
          </div>
          <div>
            <Button
              disabled={!data}
              color="primary"
              onClick={() => {
                // if (data?.allowed) {
                //   mintGasless();
                // } else {
                  mint();
                // }
              }}
              sx={{
                paddingY: 0.75,
                paddingX: 2.25,
                fontSize: 14
              }}
              variant="contained"
            >
              Mint NFT
            </Button>

          </div>
        </Box>
      </Box>
    </>
  );
}
