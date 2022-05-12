import { Upload } from "@mui/icons-material";
import { Button, LinearProgress, Stack, Tooltip } from "@mui/material";
import { FC, useEffect } from "react";
import { useSnackbar } from 'notistack';
import { useIpfsUpload } from "../../hooks/useIpfsUpload";
import { MintProps } from "./models";
import { Form, Formik } from "formik";
import { HodlFormikTextField } from "../formFields/HodlFormikTextField";
import { uploadToIPFSValidationSchema } from "../../validationSchema/uploadToIPFS";
import { commercial, nonCommercial, token } from "../../lib/copyright";

export const UploadToIpfsAction: FC<MintProps> = ({
  formData,
  setFormData,
  stepComplete,
  setLoading,
  setStepComplete,
}: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadToIpfs, progress, error, setError] = useIpfsUpload();

  // useEffect(() => {
  //   if (error !== '') {
  //     enqueueSnackbar(error, { variant: "error" });
  //     // @ts-ignore
  //     setError('');
  //   }
  //   // @ts-ignore
  // }, [error])

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
      values.privilege,
      values.fileName,
      values.mimeType,
      values.filter,
    );

    if (success) {
      setFormData(prev => ({
        ...prev,
        name: values.name,
        description: values.description,
        privilege: values.privilege,
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
          privilege: formData.privilege,
          fileName: formData.fileName,
          mimeType: formData.mimeType,
          filter: formData.filter
        }}
        validationSchema={uploadToIPFSValidationSchema}
        onSubmit={ipfsUpload}
      >
        {({ isSubmitting, values, setFieldValue, errors}) => (
          <>
          {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
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
                <HodlFormikTextField
                  name="privilege"
                  type="text"
                  label="Hodler privilege"
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
                <Stack spacing={2} direction="row">
                  <Tooltip title={token}>
                    <Button
                      color={values.privilege === token ? 'secondary' : 'primary'}
                      onClick={() => setFieldValue('privilege', token)}>Token</Button>
                  </Tooltip>
                  <Tooltip title={nonCommercial}>
                    <Button
                      color={values.privilege === nonCommercial ? 'secondary' : 'primary'}
                      onClick={() => setFieldValue('privilege', nonCommercial)}>Non Commercial</Button>
                  </Tooltip>
                  <Tooltip title={commercial}>
                    <Button
                      color={values.privilege === commercial ? 'secondary' : 'primary'}
                      onClick={() => setFieldValue('privilege', commercial)}>Commercial</Button>
                  </Tooltip>
                </Stack>
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