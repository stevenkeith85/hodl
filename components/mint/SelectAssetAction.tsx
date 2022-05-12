import { Stack } from "@mui/material";
import { FC, useCallback, useEffect } from "react";
import { FilterButtons } from "./FilterButtons";
import { useSnackbar } from 'notistack';
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { MintProps } from "./models";
import { Form, Formik } from "formik";
import { HodlDropzone } from "../formFields/HodlDropZone";

export const SelectAssetAction: FC<MintProps> = ({
  setLoading,
  formData,
  setFormData,
  setStepComplete
}: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadToCloudinary, progress, error, setError] = useCloudinaryUpload();

//   useEffect(() => {
//     if (error !== '') {
//         enqueueSnackbar(error, { variant: "error" });
//         // @ts-ignore
//         setError('');
//     }
//     // @ts-ignore
// }, [error])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length === 1) {
      enqueueSnackbar(rejectedFiles[0].errors[0].message, {variant: 'error'});
    }
    else if (acceptedFiles.length === 1) {
      cloudinaryUpload(acceptedFiles[0]);
    }
    // @ts-ignore
  }, [])

  async function cloudinaryUpload(file) {
    setLoading(true);

    enqueueSnackbar('Large files may take some time', { variant: "info" });
    // @ts-ignore
    const { success, fileName, mimeType } = await uploadToCloudinary(file);

    if (success) {
      setFormData(prev => ({
        ...prev,
        fileName,
        mimeType
      }))

      enqueueSnackbar('Asset ready for departure', { variant: "success" });
      setStepComplete(0);
    } else {
      setLoading(false);
    }
  }

  return (
    <Formik
      initialValues={{
        fileName: ''
      }}
      onSubmit={() => {}}
    >
      {() => (
        <Form>
          <Stack spacing={4}>
            <HodlDropzone onDrop={onDrop} progress={progress}/>
            <div>
              <FilterButtons formData={formData} setFormData={setFormData} />
            </div>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}