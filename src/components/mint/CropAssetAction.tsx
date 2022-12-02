import { Box, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";


export const CropAssetAction = ({
  originalAspectRatio,
  formData,
  setFormData,
  setStepComplete
}) => {

  useEffect(() => {
    setStepComplete(1);
  }, [setStepComplete])

  return (
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
          marginBottom: 4, 
          fontSize: '18px',
          color: grey[600],
          span: { fontWeight: 600 }
        }}>Crop the asset</Typography>
      <div>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr 1fr',
              sm: '1fr 1fr',
            },
            gap: 3
          }}
        >
          <div>
            <Button
              sx={{
                paddingX: 2.5,
                paddingY: 1.25,
                minWidth: '100px'
              }}
              onClick={() => setFormData(old => ({
                ...old,
                aspectRatio: originalAspectRatio
              }))}>Original</Button></div>
          <div>
            <Button
              sx={{
                paddingX: 2.5,
                paddingY: 1.25,
                minWidth: '100px'
              }}
              onClick={() => setFormData(old => ({
                ...old,
                aspectRatio: `1:1`
              }))}>1:1</Button>
          </div>
          <div>
            <Button
              sx={{
                paddingX: 2.5,
                paddingY: 1.25,
                minWidth: '100px'
              }}
              onClick={() => setFormData(old => ({
                ...old,
                aspectRatio: `4:5`
              }))}>4:5</Button>
          </div>
          <div>
            <Button
              sx={{
                paddingX: 2.5,
                paddingY: 1.25,
                minWidth: '100px'
              }}
              onClick={() => setFormData(old => ({
                ...old,
                aspectRatio: `16:9`
              }))}>16:9</Button>
          </div>
        </Box>
      </div>
    </Box>

  )
}