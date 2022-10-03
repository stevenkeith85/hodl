import { FC, useCallback } from "react";
import { enqueueSnackbar } from 'notistack';
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { MintProps } from "./models";
import { Form, Formik } from "formik";
import { HodlDropzone } from "../formFields/HodlDropZone";
import calculateAspectRatios from 'calculate-aspect-ratio';

export const SelectAssetAction: FC<MintProps> = ({
  setLoading,
  formData,
  setFormData,
  setStepComplete
}: MintProps) => {
  const [uploadToCloudinary, progress] = useCloudinaryUpload();

  const cloudinaryUpload = useCallback(async (file) => {
    setLoading(true);

    enqueueSnackbar(
      `Large files may take some time`,
      {
        // @ts-ignore
        variant: "hodlsnackbar",
        type: "info"
      });

    const { success, fileName, mimeType } = await uploadToCloudinary(file);

    if (success) {
      setFormData(prev => ({
        ...prev,
        fileName,
        mimeType
      }))

      setStepComplete(0);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [enqueueSnackbar, setFormData, setLoading, setStepComplete, uploadToCloudinary]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length === 1) {
      enqueueSnackbar(
        rejectedFiles?.[0]?.errors?.[0]?.message,
        {
          // @ts-ignore
          variant: "hodlsnackbar",
          type: "error"
        });
    }
    else if (acceptedFiles.length === 1) {
      cloudinaryUpload(acceptedFiles[0]);
    }
  }, [cloudinaryUpload, enqueueSnackbar]);


  return (
    <Formik
      initialValues={{
        fileName: ''
      }}
      onSubmit={() => { }}
    >
      {() => (
        <Form>
          <HodlDropzone onDrop={onDrop} progress={progress} />
        </Form>
      )}
    </Formik>
  )
}