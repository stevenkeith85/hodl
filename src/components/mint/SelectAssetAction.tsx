import { FC, useCallback, useEffect, useState } from "react";
import { enqueueSnackbar } from 'notistack';
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";
import { MintProps } from "./models";
import { Form, Formik } from "formik";
import { HodlDropzone } from "../formFields/HodlDropZone";

export const SelectAssetAction: FC<MintProps> = ({
  loading,
  setLoading,
  formData,
  setFormData,
  setStepComplete
}: MintProps) => {
  const [uploadToCloudinary, error, setError] = useCloudinaryUpload();

  useEffect(() => {
    if (error !== '') {
        enqueueSnackbar(error,
            {
                // @ts-ignore
                variant: "hodlsnackbar",
                type: "error"
            });

        setError('');
    }
}, [error, enqueueSnackbar]) //  Warning: React Hook useEffect has a missing dependency: 'enqueueSnackbar'. Either include it or remove the dependency array.

  const cloudinaryUpload = useCallback(async (file) => {
    setLoading(true);

    const { success, fileName, mimeType } = await uploadToCloudinary(file);

    if (success) {
      setFormData(prev => ({
        ...prev,
        fileName,
        mimeType,
        // TODO - We should probably reset the aspect ratio if the user changes the asset. Need to check how this will affect videos first though
        // aspectRatio: null 
      }))

      setStepComplete(0);
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

  const [selectedFiles, setSelectedFiles] = useState(null);


  return (
    <Formik
      initialValues={{
        fileName: ''
      }}
      onSubmit={() => { }}
    >
      {() => (
        <Form>
          <HodlDropzone onDrop={onDrop} loading={loading}/>
          {/* <input type="file" name="file" onChange={event => setSelectedFiles(event.target.files)} />
          <Button disabled={!selectedFiles} onClick={(e) => onDrop(selectedFiles, [])}>Submit</Button> */}
        </Form>
      )}
    </Formik>
  )
}