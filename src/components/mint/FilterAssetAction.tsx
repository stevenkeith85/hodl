import Box from "@mui/material/Box";
import { FC, useEffect } from "react";
import { AssetPreview } from "./AssetPreview";
import { FilterButtons } from "./FilterButtons";

export const FilterAssetAction = ({
  formData,
  setFormData,
  stepComplete,
  setStepComplete,
  activeStep,
  originalAspectRatio
}) => {

  useEffect(() => {
    if (stepComplete === 1) {
      setStepComplete(2); // optional step
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
          <FilterButtons formData={formData} setFormData={setFormData} />
        </Box>
      </Box>
    </Box>
  )
}