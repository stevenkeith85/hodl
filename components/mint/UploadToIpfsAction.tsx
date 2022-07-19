import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import { useSnackbar } from 'notistack';
import { useIpfsUpload } from "../../hooks/useIpfsUpload";
import { MintProps } from "./models";
import { Field, Form, Formik } from "formik";
import { uploadToIPFSValidationSchema } from "../../validationSchema/uploadToIPFS";
import { commercial, nonCommercial, token } from "../../lib/copyright";
import { TextField } from 'formik-mui';
import { grey } from "@mui/material/colors";
import { HodlerPrivilegeTooltip } from "../tooltips/HodlerPrivilegeTooltip";
import { CommercialTooltip } from "../tooltips/CommercialTooltip";
import { NonCommercialTooltip } from "../tooltips/NonCommercialTooltip";
import { TokenOnlyTooltip } from "../tooltips/TokenOnlyTooltip";


const UploadTooltip = () => (
  <Box padding={2}>
    <Typography mb={2}>
      Upload the asset and its metadata to IPFS.
    </Typography>
    <Typography mb={2}>
      This decentralizes the content.
    </Typography>
    <Typography>
      Once uploaded the asset and its metadata cannot change.
    </Typography>
  </Box>
)

export const UploadToIpfsAction: FC<MintProps> = ({
  formData,
  setFormData,
  stepComplete,
  setLoading,
  setStepComplete,
}: MintProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadToIpfs, progress, error, setError] = useIpfsUpload();


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
      setStepComplete(2);
    }

    setSubmitting(false);
    setLoading(false);
  }
  return (

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
      {({ isSubmitting, values, setFieldValue, errors, dirty, isValid }) => (
        <>
          {/* <pre>{JSON.stringify(formData, null, 2)}</pre>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre> */}
          <Form>
            <Stack spacing={2}>
              <FormControl>
                <Field
                  disabled={stepComplete >= 2}
                  component={TextField}
                  name="name"
                  label="Name"
                  type="text"
                  autoComplete='off'
                />
              </FormControl>
              <FormControl>
              <Field
                  disabled={stepComplete >= 2}
                  multiline
                  minRows={4}
                  component={TextField}
                  name="description"
                  label="Description"
                  type="text"
                  autoComplete='off'
                />
                
              </FormControl>
              <Box>
                <FormControl disabled={stepComplete >= 2}>
                  <Tooltip
                    title={<HodlerPrivilegeTooltip />}
                    placement="right-start"
                    arrow>
                    <FormLabel sx={{ marginBottom: 1 }}>Hodler privilege</FormLabel>
                  </Tooltip>
                  <RadioGroup
                    name="hodler-privilege"
                  >
                    <Tooltip
                      title={<TokenOnlyTooltip />}
                      placement="right-start"
                      arrow>
                      <FormControlLabel
                        onClick={() => setFieldValue('privilege', token)}
                        value={token}
                        control={<Radio size="small" sx={{ paddingY: 0.75}}/>}
                        label={<Typography color={grey[700]}>Token Only</Typography>}
                      />
                    </Tooltip>
                    <Tooltip
                      title={<NonCommercialTooltip />}
                      placement="right-start"
                      arrow>
                      <FormControlLabel
                        onClick={() => setFieldValue('privilege', nonCommercial)}
                        value={nonCommercial}
                        control={<Radio size="small" sx={{ paddingY: 0.75}}/>}
                        label={<Typography color={grey[700]}>Non Commercial</Typography>}
                      />
                    </Tooltip>
                    <Tooltip
                      title={<CommercialTooltip />}
                      placement="right-start"
                      arrow>
                      <FormControlLabel
                        onClick={() => setFieldValue('privilege', commercial)}
                        value={commercial}
                        control={<Radio size="small" sx={{ paddingY: 0.75}}/>}
                        label={<Typography color={grey[700]}>Commercial</Typography>}
                      /></Tooltip>
                  </RadioGroup>
                </FormControl>
              </Box>
              <div>
                <Tooltip
                  title={<UploadTooltip />}
                  placement="right-start"
                  arrow>
                  <Button
                    color="secondary"
                    sx={{
                      paddingX: 2
                    }}
                    type="submit"
                    disabled={isSubmitting || stepComplete === 2 || !isValid || !dirty}
                  >
                    Upload
                  </Button>
                </Tooltip>
              </div>
            </Stack>
          </Form>
        </>)}
    </Formik>
  )
}