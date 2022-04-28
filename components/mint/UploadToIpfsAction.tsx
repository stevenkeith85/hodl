import { Upload } from "@mui/icons-material";
import { Button, LinearProgress, Stack } from "@mui/material";
import { FC, useEffect } from "react";
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
  const [uploadToIpfs, progress, error, setError] = useIpfsUpload();

  useEffect(() => {
    if (error !== '') {
      enqueueSnackbar(error, { variant: "error" });
      // @ts-ignore
      setError('');
    }
    // @ts-ignore
  }, [error])

  async function ipfsUpload(values, { setSubmitting }) {
    setLoading(true);
    setSubmitting(true);

    enqueueSnackbar('Transferring asset to IPFS', { variant: "info" });

    if (values.mimeType.indexOf('video') !== -1) {
      enqueueSnackbar('Large files may take some time', { variant: "info" });
    }

    let { success, imageCid, metadataUrl } = await uploadToIpfs(
      values.name,
      values.description,
      values.fileName,
      values.mimeType,
      values.filter
    );

    if (success) {
      setFormData(prev => ({
        ...prev,
        name: values.name,
        description: values.description,
        metadataUrl
      }))
      enqueueSnackbar('IPFS Upload Success', { variant: "success" });
      setStepComplete(1);
    }

    setSubmitting(false);
    setLoading(false);
  }
  return (
    <Stack spacing={4}>
      <Formik
        initialValues={{
          name: formData.name,
          description: formData.description,
          fileName: formData.fileName,
          mimeType: formData.mimeType,
          filter: formData.filter
        }}
        validationSchema={uploadToIPFSValidationSchema}
        onSubmit={ipfsUpload}
      >
        {({ isSubmitting }) => (
          <>
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
          </>)}
      </Formik>
      <LinearProgress variant="determinate" value={progress} />
    </Stack>
  )
}