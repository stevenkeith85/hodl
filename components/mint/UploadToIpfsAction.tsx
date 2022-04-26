import { Upload } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { FC } from "react";
import { useSnackbar } from 'notistack';
import { useIpfsUpload } from "../../hooks/useIpfsUpload";
import { MintProps } from "./models";
import { Form, Formik } from "formik";
import { HodlFormikTextField } from "../formFields/HodlFormikTextField";
import { uploadToIPFSValidationSchema } from "../../validationSchema/uploadToIPFS";

export const UploadToIpfsAction: FC<MintProps> = ({
  formData,
  setFormData,
  stepComplete,
  setLoading,
  setStepComplete,

}: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadToIpfs, apiError] = useIpfsUpload();

  async function ipfsUpload(values, { setSubmitting }) {
    setLoading(true);
    setSubmitting(true);

    enqueueSnackbar('Transferring asset to IPFS', { variant: "info" });
    enqueueSnackbar('Large files may take some time', { variant: "info" });

    let { success, imageCid, metadataUrl, message } = await uploadToIpfs(values.name, values.description, formData.fileName, formData.mimeType, formData.filter);

    if (success) {
      setFormData(prev => ({
        ...prev,
        name: values.name,
        description: values.description,
        metadataUrl
      }))
      enqueueSnackbar('IPFS Upload Success', { variant: "success" });
      setStepComplete(1);
    } else {
      enqueueSnackbar(message, { variant: "error" });
      enqueueSnackbar('Please try again', { variant: "warning" });
    }

    setSubmitting(false);
    setLoading(false);
  }
  return (
    <Formik
      initialValues={{
        name: formData.name,
        description: formData.description
      }}
      validationSchema={uploadToIPFSValidationSchema}
      onSubmit={ipfsUpload}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stack spacing={2}>
            <HodlFormikTextField
              name="name"
              type="text"
              label="Name"
              disabled={stepComplete === 1}
            />
            <HodlFormikTextField
              name="description"
              type="text"
              label="Description"
              multiline
              minRows={8}
              disabled={stepComplete === 1}
            />
            <div>
              <Button
                startIcon={<Upload fontSize="large" />}
                type="submit"
                disabled={isSubmitting || stepComplete === 1}
              >
                Upload To IPFS
              </Button>
            </div>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}