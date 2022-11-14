import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Fab from '@mui/material/Fab';


export const MintProgressButtons = ({ stepComplete, activeStep, setActiveStep, loading, formData }) => {
  const isAudio = mimeType => mimeType && mimeType.indexOf('audio') !== -1;
  const isVideo = mimeType => mimeType && mimeType.indexOf('video') !== -1;
  const isGif = mimeType => mimeType && mimeType.indexOf('gif') !== -1;

  if (activeStep === 4  || stepComplete === -1) {
    return null;
  }

  return (
    <>
      {stepComplete >= 0 && stepComplete < 2 && activeStep > 0 && <Fab
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
    </>
  )
};
