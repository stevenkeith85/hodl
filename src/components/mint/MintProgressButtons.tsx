import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Fab from '@mui/material/Fab';
import { useSnackbar } from 'notistack';
import { useEffect, useRef } from 'react';
import { useUploadAsset } from '../../hooks/useUploadAsset';


export const MintProgressButtons = ({ stepComplete, activeStep, setActiveStep, loading, formData, setFormData, setStepComplete }) => {
  const isAudio = mimeType => mimeType && mimeType.indexOf('audio') !== -1;
  const isVideo = mimeType => mimeType && mimeType.indexOf('video') !== -1;
  const isGif = mimeType => mimeType && mimeType.indexOf('gif') !== -1;

  const uploadAsset = useUploadAsset();
  const { enqueueSnackbar } = useSnackbar();

  const lastUpload = useRef(null);

  const isUploadTheSameAsLastTime = () => {
    return JSON.stringify({
      fileName: formData.filename,
      filter: formData.filter,
      mimeType: formData.mimeType,
      aspectRatio: formData.aspectRatio
    }) == JSON.stringify(lastUpload.current)
  }

  async function uploadAssetAndUpdateFormData() {
    try {
      if (isUploadTheSameAsLastTime()) {
        return; // we don't want to reupload the exact same thing
      }

      // if the user has changed the image, 
      // they NEED to reupload the metadata so that it points to the correct image
      setStepComplete(2); 

      // Clear the old data
      setFormData(prev => ({
        ...prev,
        imageCid: null,
        assetCid: null
      }));

      const { imageCid, assetCid } = await uploadAsset(
        formData.fileName,
        formData.filter,
        formData.mimeType,
        formData.aspectRatio,
      );

      setFormData(prev => ({
        ...prev,
        imageCid,
        assetCid
      }));

      lastUpload.current = {
        fileName: formData.filename,
        filter: formData.filter,
        mimeType: formData.mimeType,
        aspectRatio: formData.aspectRatio
      }

      
    } catch (e) {
      enqueueSnackbar(
        e.message,
        {
          variant: "error",
          hideIconVariant: true
        });
    }
  }


  useEffect(() => {
    if (activeStep === 3) {
      uploadAssetAndUpdateFormData()
    }
  }, [activeStep])

  return (
    <>
      {activeStep > 0 &&
      <Fab
        size="small"
        color="secondary"
        sx={{
          position: 'absolute',
          left: -16,
          top: `50%`,
          opacity: 0.75,
          '&:hover': {
            opacity: 1
          }
        }}
        onClick={
          () => {
            if (
              (
                isAudio(formData?.mimeType) ||
                isVideo(formData?.mimeType) ||
                isGif(formData?.mimeType)
              ) && activeStep == 3) {
              setActiveStep(activeStep => activeStep - 3);
            } else {
              setActiveStep(activeStep => activeStep - 1)
            }
          }
        }>
        <NavigateBeforeIcon />
      </Fab>
      }
      { stepComplete >= activeStep  && activeStep < 4 &&
        <Fab
          size="small"
          color="secondary"
          sx={{
            position: 'absolute',
            right: -16,
            top: `50%`,
            opacity: 0.75,
            '&:hover': {
              opacity: 1
            }
          }}
          onClick={() => {
            if (
              (
                isAudio(formData?.mimeType) ||
                isVideo(formData?.mimeType) ||
                isGif(formData?.mimeType)
              ) &&
              activeStep == 0) {
              setActiveStep(activeStep => activeStep + 3);
            } else {
              setActiveStep(activeStep => activeStep + 1)
            }
          }}>
          <NavigateNextIcon />
        </Fab>
        }
    </>
  )
};
