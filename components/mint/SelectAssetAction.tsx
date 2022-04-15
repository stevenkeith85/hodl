import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { HodlTextField } from "../HodlTextField";
import { FilterButtons } from "./FilterButtons";
import { useSnackbar } from 'notistack';
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { MintProps } from "./models";

export const SelectAssetAction: FC<MintProps> = ({ 
  loading, 
  setLoading, 
  formData,
  setFormData,
  setStepComplete 
}: MintProps) => 
{
  const { enqueueSnackbar } = useSnackbar();
  const [uploadToCloudinary] = useCloudinaryUpload();

  async function cloudinaryUpload(e) {
    setLoading(true);

    enqueueSnackbar('Large files may take some time', { variant: "info" });
    const { success, fileName, mimeType } = await uploadToCloudinary(e.target.files[0]);

    if (success) {
      setFormData(prev => ({
        ...prev,
        fileName,
        mimeType
      }))

      enqueueSnackbar('Asset ready for departure', { variant: "success" });
      setStepComplete(0);
    } else {
      e.target.value = ''; // clear the input and ask the user to try again

      enqueueSnackbar('Please try again', { variant: "warning" });
      setLoading(false);
    }
  }

  return (
    <>
      <Stack spacing={4}>
        <div>
          <Typography marginBottom={2} variant="h2">Asset</Typography>
          <HodlTextField
            type="file"
            onChange={cloudinaryUpload}
            disabled={loading}
          />
        </div>
        <div>
          <Typography marginBottom={2}  variant="h2">Filter</Typography>
          <FilterButtons formData={formData} setFormData={setFormData} />
        </div>
      </Stack>
    </>
  )
}