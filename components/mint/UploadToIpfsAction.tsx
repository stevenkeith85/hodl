import { Upload } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { HodlButton } from "../HodlButton";
import { FC } from "react";
import { useSnackbar } from 'notistack';
import { useIpfsUpload } from "../../hooks/useIpfsUpload";
import { MintProps } from "./models";
import { Form, Formik } from "formik";
import * as yup from 'yup';
import { HodlFormikTextField } from "../formFields/HodlFormikTextField";

const validationSchema = yup.object({
  name: yup
    .string()
    .ensure()
    .min(1)
    .max(100)
    .required(),
  description: yup
    .string()
    .ensure()
    .min(1)
    .max(1000)
    .required(),
});

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
      validationSchema={validationSchema}
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
              <HodlButton
                startIcon={<Upload fontSize="large" />}
                type="submit"
                disabled={isSubmitting || stepComplete === 1}
              >
                Upload To IPFS
              </HodlButton>
            </div>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}