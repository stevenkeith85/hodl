import { Box } from "@mui/material";
import { FC, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";

interface FilterAssetActionProps {
  formData: any;
  setFormData?: Function;
  setStepComplete?: Function;
  activeStep: number;
};

export const FilterAssetAction: FC<FilterAssetActionProps> = ({
  formData,
  setFormData,
  setStepComplete,
  activeStep
}) => {

  useEffect(() => {
    if (activeStep === 2) {
      setStepComplete(2); // no requirement to actually pick a filter
    }
  }, [activeStep])

  return (
    <Box>
      <FilterButtons
        formData={formData}
        setFormData={setFormData}
      />
    </Box >
  )
}