import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Stack, Button, Box, IconButton, Fab } from '@mui/material';

export const MintProgressButtons = ({ stepComplete, activeStep, setActiveStep, loading, formData }) => {

  const isVideo = mimeType => mimeType && mimeType.indexOf('video') !== -1;
  const isGif = mimeType => mimeType && mimeType.indexOf('gif') !== -1;

  if (stepComplete < 0 || stepComplete > 2) {
    return null;
  }

  return (
    <>
      {stepComplete > 0 && activeStep > 0 && <Fab
        size="small"
        color="secondary"
        sx={{
          position: 'absolute',
          left: 0,
          top: `50%`,
          opacity: 0.75,
          '&:hover': {
            opacity: 1
          }
        }}
        disabled={loading || activeStep === 0 || stepComplete >= 3}
        onClick={
          () => {
            if ((isVideo(formData?.mimeType) || isGif(formData?.mimeType)) && activeStep == 3) {
              setActiveStep(activeStep => activeStep - 3);
            } else {
              setActiveStep(activeStep => activeStep - 1)
            }
          }
        }>
        <NavigateBefore />
      </Fab>}
      <Fab
        size="small"
        color="secondary"
        sx={{
          position: 'absolute',
          right: 0,
          top: `50%`,
          opacity: 0.75,
          '&:hover': {
            opacity: 1
          }
        }}
        disabled={loading || stepComplete < activeStep}
        onClick={() => {
          if ((isVideo(formData?.mimeType) || isGif(formData?.mimeType)) && activeStep == 0) {
            setActiveStep(activeStep => activeStep + 3);
          } else {
            setActiveStep(activeStep => activeStep + 1)
          }
        }}>
        <NavigateNext />
      </Fab>
    </>
  )
};
