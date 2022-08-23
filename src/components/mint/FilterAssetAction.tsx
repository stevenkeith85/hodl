import { Filter } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FC, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";
import { MintProps } from "./models";

interface FilterAssetActionProps {
  formData: any;
  setFormData?: Function;
  setStepComplete?: Function;
};

export const FilterAssetAction: FC<FilterAssetActionProps> = ({
  formData,
  setFormData,
  setStepComplete
}: MintProps) => {

  useEffect(() => {
    setStepComplete(2);
  }, [setStepComplete])

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="550px"
      gap={4}
    >
      {/* <Filter sx={{ fontSize: 82, color: grey[400] }} /> */}
      {/* <Typography
        sx={{
          fontSize: '18px',
          color: grey[600],
          span: { fontWeight: 600 }
        }}>Filter</Typography> */}
      <FilterButtons formData={formData} setFormData={setFormData} />
    </Box>
  )
}