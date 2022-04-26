import { Typography, Stack, Button } from '@mui/material';
import { SuccessModal } from '../index';
import { Rocket } from '@mui/icons-material';
import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';

import { UnableToStoreModal } from '../UnableToStoreModal';
import { useStoreToken } from '../../hooks/useStoreToken';
import { MintProps } from './models';


export const AddToHodlAction: FC<MintProps> = ({ 
  stepComplete, 
  loading, 
  setStepComplete,
  formData,
  setFormData,
  setLoading
}: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [store] = useStoreToken();

  const [unableToSaveModalOpen, setUnableToSaveModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  async function hodl() {
    setLoading(true);
    
    const { tokenId, mimeType, filter } = formData;
    const success = await store(tokenId, mimeType, filter);
    
    setLoading(false);

    if (success) {
      enqueueSnackbar('Successfully added your token to HodlMyMoon', { variant: "success" });
      setStepComplete(3);
      setSuccessModalOpen(true);
    } else {
      setUnableToSaveModalOpen(true);
    }
  }

  return (
    <>
      <UnableToStoreModal
        setUnableToSaveModalOpen={setUnableToSaveModalOpen}
        unableToSaveModalOpen={unableToSaveModalOpen}
        tokenId={formData.tokenId}
        retry={hodl}
      />
      <SuccessModal
        modalOpen={successModalOpen}
        setModalOpen={setSuccessModalOpen}
        message="You&apos;ve successfully minted your token and added it to HodlMyMoon"
        tab={0}
      />
      <Stack spacing={4}>
        <Typography variant="h2">Hodl My Moon</Typography>
        <Typography sx={{ span: { fontWeight: 600 } }}>You can now add your token <span>{formData.name}</span> to HodlMyMoon</Typography>
        <div>
          <Button
            onClick={hodl}
            disabled={stepComplete === 3 || loading}
            startIcon={<Rocket fontSize="large" />}
          >
            Add Token
          </Button>
        </div>
      </Stack>
    </>
  );
}
