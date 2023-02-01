import { useSnackbar } from 'notistack';

import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { HodlDropzone } from "../formFields/HodlDropZone";
import Box from "@mui/material/Box";
import { AssetTypes } from '../../models/AssetType';
import { assetTypeFromMimeType } from '../../lib/utils';


export const SelectAssetAction = ({
  loading,
  setLoading,
  setFormData,
  setStepComplete,
  setActiveStep,
  setOriginalAspectRatio
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const uploadToCloudinary = useCloudinaryUpload();

  const cloudinaryUpload = async file => {
    setLoading(true);

    try {
      const { fileName, mimeType, aspectRatio } = await uploadToCloudinary(file);

      setOriginalAspectRatio(aspectRatio);

      setFormData(prev => ({
        ...prev,
        fileName,
        mimeType,
        aspectRatio
      }))
      setStepComplete(0);
      
      // we only allow filtering of images
      if (assetTypeFromMimeType(mimeType) !== AssetTypes.Image) {
        setActiveStep(3);
      } else {
        setActiveStep(1);
      }

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

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length === 1) {
      enqueueSnackbar(
        rejectedFiles?.[0]?.errors?.[0]?.message,
        {
          variant: "error",
          hideIconVariant: true
        });
    }
    else if (acceptedFiles.length === 1) {
      cloudinaryUpload(acceptedFiles[0]);
    }
  };

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <HodlDropzone
        onDrop={onDrop}
        loading={loading}
      />
    </Box>
  )
}