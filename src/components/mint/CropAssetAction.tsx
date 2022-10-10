import { CloudSyncOutlined, Crop } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";


export const CropAssetAction = ({
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
      <Crop sx={{ fontSize: 82, color: grey[400] }} />
      <Typography
        sx={{
          fontSize: '18px',
          color: grey[600],
          span: { fontWeight: 600 }
        }}>Crop</Typography>
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
              variant={formData.aspectRatio === null ? 'contained' : 'outlined'}
              onClick={() => setFormData(old => ({
                ...old,
                aspectRatio: null
              }))}>Original</Button></div>
          <div>
            <Button
              sx={{
                paddingX: 2.5,
                paddingY: 1.25,
                minWidth: '100px'
              }}
              variant={formData.aspectRatio === "1:1" ? 'contained' : 'outlined'}
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
              variant={formData.aspectRatio === "4:5" ? 'contained' : 'outlined'}
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
              variant={formData.aspectRatio === "16:9" ? 'contained' : 'outlined'}
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