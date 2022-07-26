import { Stack, Button } from '@mui/material';

export const MintProgressButtons = ({ stepComplete, activeStep, setActiveStep, loading, formData }) => {

  const isVideo = mimeType => mimeType && mimeType.indexOf('video') !== -1;
  const isGif = mimeType => mimeType && mimeType.indexOf('gif') !== -1;

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        width: '100%'
      }}      
    >
      <Button
        color="primary"
        sx={{ paddingX: 3, }}
        disabled={loading || activeStep === 0 || stepComplete >= 2}
        variant="outlined"
        onClick={
          () => {
            if ((isVideo(formData?.mimeType) || isGif(formData?.mimeType)) && activeStep == 2) {
              setActiveStep(activeStep => activeStep - 2);
            } else {
              setActiveStep(activeStep => activeStep - 1)
            }
          }
        }>
        Back
      </Button>
      <Button
        color="secondary"
        sx={{ paddingX: 3, }}
        disabled={loading || stepComplete < activeStep}
        variant="outlined"
        onClick={() => {
          if ((isVideo(formData?.mimeType) || isGif(formData?.mimeType)) && activeStep == 0) {
            setActiveStep(activeStep => activeStep + 2);
          } else {
            setActiveStep(activeStep => activeStep + 1)
          }
        }}>
        Next
      </Button>
    </Stack>
  )
};
