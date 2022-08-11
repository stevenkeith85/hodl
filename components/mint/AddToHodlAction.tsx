import { Typography, Stack, Button, Box } from '@mui/material';
import { SuccessModal } from '../index';
import { CloudSyncOutlined, NightsStayOutlined, Rocket } from '@mui/icons-material';
import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';

import { UnableToStoreModal } from '../modals/UnableToStoreModal';
import { useStoreToken } from '../../hooks/useStoreToken';
import { MintProps } from './models';
import { grey } from '@mui/material/colors';


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
      setStepComplete(4);
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
    
      <Box 
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="400px"
      gap={4}
    >
      <NightsStayOutlined sx={{ fontSize: 82, color: grey[400]}} />
      <Typography 
        sx={{ 
          fontSize: '18px',
          color: grey[600],
          span: { fontWeight: 600 } }}>Click the button to add your NFT <span>{formData.name}</span> to Hodl My Moon</Typography>
      <div>
        <Button
        
          color="secondary"
          disabled={stepComplete === 5 || loading}
          onClick={hodl}
        >
          Hodl
        </Button>
      </div>
    </Box>
    </>
  );
}
