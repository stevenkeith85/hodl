import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { AssetPreview } from "./AssetPreview";


export const CropButtons = ({ originalAspectRatio, formData, setFormData }) => (<>
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr 1fr',
        sm: '1fr 1fr',
      },
      gap: 3,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button
        variant={formData.aspectRatio === originalAspectRatio ? 'contained' : 'outlined'}
        sx={{
          paddingX: 2.5,
          paddingY: 1.25,
          width: '100px'
        }}
        onClick={() => setFormData(old => ({
          ...old,
          aspectRatio: originalAspectRatio
        }))}>Original</Button>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button
        variant={formData.aspectRatio === '1:1' ? 'contained' : 'outlined'}
        sx={{
          paddingX: 2.5,
          paddingY: 1.25,
          width: '100px'
        }}
        onClick={() => setFormData(old => ({
          ...old,
          aspectRatio: `1:1`
        }))}>1:1</Button>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button
        variant={formData.aspectRatio === '4:5' ? 'contained' : 'outlined'}
        sx={{
          paddingX: 2.5,
          paddingY: 1.25,
          width: '100px'
        }}
        onClick={() => setFormData(old => ({
          ...old,
          aspectRatio: `4:5`
        }))}>4:5</Button>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button
        variant={formData.aspectRatio === '16:9' ? 'contained' : 'outlined'}
        sx={{
          paddingX: 2.5,
          paddingY: 1.25,
          width: '100px'
        }}
        onClick={() => setFormData(old => ({
          ...old,
          aspectRatio: `16:9`
        }))}>16:9</Button>
    </Box >
  </Box>
</>)

export const CropAssetAction = ({
  originalAspectRatio,
  formData,
  setFormData,
  stepComplete,
  setStepComplete
}) => {

  useEffect(() => {
    if (stepComplete === 0) {
      setStepComplete(1); // optional step
    }
    
  }, [stepComplete])

  return (
    <Box sx={{
      minHeight: {
        xs: 555,
        md: 605,
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AssetPreview originalAspectRatio={originalAspectRatio} formData={formData} setFormData={setFormData} />
        <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          marginY: 4
        }}
        >
        <CropButtons originalAspectRatio={originalAspectRatio} formData={formData} setFormData={setFormData} />
        </Box>  
      </Box>
    </Box>
  )
}